using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private static readonly SemaphoreSlim _rateLimiter = new(1, 1);
    private static readonly Queue<DateTime> _requestTimestamps = new();
    private const int MaxRequestsPerMinute = 50;

    public AIController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpPost("chat")]
    public async Task<ActionResult<AiResponse>> Chat([FromBody] AiRequest request)
    {
        var apiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            return BadRequest(new AiResponse { Error = "Chave da API Gemini não configurada. Configure a variável de ambiente Gemini__ApiKey." });

        if (string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest(new AiResponse { Error = "Prompt é obrigatório." });

        // ── Rate limiter: aguarda se estourou o limite por minuto ──
        await EnforceRateLimit();

        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(30);

        var geminiPayload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = BuildPrompt(request.Prompt, request.Context) }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.7,
                maxOutputTokens = 1024,
                topP = 0.95,
            }
        };

        var jsonPayload = JsonSerializer.Serialize(geminiPayload);

        // ── Retry com exponential backoff para 429 ──
        var maxRetries = 3;
        var baseDelayMs = 1000;

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            var httpContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}",
                httpContent
            );

            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    using var doc = JsonDocument.Parse(responseBody);
                    var text = doc.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    return Ok(new AiResponse { Text = text });
                }
                catch (Exception ex)
                {
                    return Ok(new AiResponse
                    {
                        Error = $"Falha ao processar resposta da IA: {ex.Message}",
                        RawResponse = responseBody
                    });
                }
            }

            // Se for 429 (rate limit) e ainda temos tentativas, espera e retry
            if ((int)response.StatusCode == 429 && attempt < maxRetries)
            {
                var delay = baseDelayMs * (int)Math.Pow(2, attempt - 1); // 1s, 2s, 4s
                await Task.Delay(delay);
                continue;
            }

            // Se for 429 na última tentativa, retorna erro amigável
            if ((int)response.StatusCode == 429)
            {
                return StatusCode(429, new AiResponse
                {
                    Error = "A IA está temporariamente sobrecarregada. Aguarde alguns segundos e tente novamente.",
                    RetryAfter = 5
                });
            }

            // Outros erros
            return StatusCode((int)response.StatusCode, new AiResponse
            {
                Error = $"Erro na API Gemini: {(int)response.StatusCode}",
                RawResponse = responseBody
            });
        }

        return StatusCode(500, new AiResponse { Error = "Erro inesperado após todas as tentativas." });
    }

    private static async Task EnforceRateLimit()
    {
        await _rateLimiter.WaitAsync();
        try
        {
            var now = DateTime.UtcNow;
            // Remove timestamps mais antigos que 1 minuto
            while (_requestTimestamps.Count > 0 && (now - _requestTimestamps.Peek()).TotalSeconds > 60)
            {
                _requestTimestamps.Dequeue();
            }

            if (_requestTimestamps.Count >= MaxRequestsPerMinute)
            {
                var oldest = _requestTimestamps.Peek();
                var waitMs = (int)(60000 - (now - oldest).TotalMilliseconds) + 100;
                if (waitMs > 0)
                    await Task.Delay(waitMs);
            }

            _requestTimestamps.Enqueue(DateTime.UtcNow);
        }
        finally
        {
            _rateLimiter.Release();
        }
    }

    private static string BuildPrompt(string prompt, string? context)
    {
        var sb = new StringBuilder();
        sb.AppendLine("You are an expert English teacher AI assistant. Respond in the same language as the user's prompt.");
        sb.AppendLine("Provide clear, structured, helpful feedback for language learners.");
        sb.AppendLine();

        if (!string.IsNullOrWhiteSpace(context))
        {
            sb.AppendLine($"Context: {context}");
            sb.AppendLine();
        }

        sb.AppendLine(prompt);
        return sb.ToString();
    }
}

public class AiRequest
{
    [JsonPropertyName("prompt")]
    public string Prompt { get; set; } = null!;

    [JsonPropertyName("context")]
    public string? Context { get; set; }
}

public class AiResponse
{
    [JsonPropertyName("text")]
    public string? Text { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }

    [JsonPropertyName("rawResponse")]
    public string? RawResponse { get; set; }

    [JsonPropertyName("retryAfter")]
    public int? RetryAfter { get; set; }
}
