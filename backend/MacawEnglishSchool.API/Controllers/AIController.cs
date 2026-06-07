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
            return BadRequest(new AiResponse { Error = "Gemini API key not configured. Set Gemini__ApiKey environment variable." });

        if (string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest(new AiResponse { Error = "Prompt is required." });

        var client = _httpClientFactory.CreateClient();

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
        var httpContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}",
            httpContent
        );

        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, new AiResponse
            {
                Error = $"Gemini API error: {response.StatusCode}",
                RawResponse = responseBody
            });
        }

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
                Error = $"Failed to parse Gemini response: {ex.Message}",
                RawResponse = responseBody
            });
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
}
