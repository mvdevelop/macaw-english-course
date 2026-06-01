using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly SeedService _seedService;

    public SeedController(SeedService seedService) => _seedService = seedService;

    /// <summary>
    /// Import all JSON seed files from the SeedData folder.
    /// Skips modules that already have lessons in the database.
    /// </summary>
    [HttpPost("all")]
    public async Task<ActionResult> SeedAll()
    {
        var result = await _seedService.SeedAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Import a specific seed file by name (e.g., "A1-module1.json").
    /// </summary>
    [HttpPost("file")]
    public async Task<ActionResult> SeedFile([FromBody] SeedFileRequest request)
    {
        var result = await _seedService.SeedFileAsync(request.FileName);
        return Ok(result);
    }

    /// <summary>
    /// List available seed files in the SeedData folder.
    /// </summary>
    [HttpGet("files")]
    public ActionResult<List<string>> ListFiles()
    {
        var seedPath = Path.Combine(Directory.GetCurrentDirectory(), "SeedData");
        if (!Directory.Exists(seedPath))
            return Ok(new List<string>());

        var files = Directory.GetFiles(seedPath, "*.json")
            .Select(Path.GetFileName)
            .ToList();

        return Ok(files);
    }
}

public class SeedFileRequest
{
    public string FileName { get; set; } = string.Empty;
}
