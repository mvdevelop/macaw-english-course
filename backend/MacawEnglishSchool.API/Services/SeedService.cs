using System.Text.Json;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Services;

public class SeedService
{
    private readonly ILessonRepository _lessonRepository;
    private readonly IModuleTestRepository _testRepository;
    private readonly string _seedDataPath;

    public SeedService(ILessonRepository lessonRepository, IModuleTestRepository testRepository, IWebHostEnvironment env)
    {
        _lessonRepository = lessonRepository;
        _testRepository = testRepository;
        // Seed data files are in the SeedData folder
        _seedDataPath = Path.Combine(env.ContentRootPath, "SeedData");
    }

    public async Task<SeedResult> SeedAllAsync()
    {
        var result = new SeedResult();

        if (!Directory.Exists(_seedDataPath))
        {
            result.Messages.Add($"SeedData directory not found at: {_seedDataPath}");
            return result;
        }

        var jsonFiles = Directory.GetFiles(_seedDataPath, "*.json");
        if (jsonFiles.Length == 0)
        {
            result.Messages.Add("No JSON files found in SeedData.");
            return result;
        }

        foreach (var file in jsonFiles)
        {
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var seedData = JsonSerializer.Deserialize<SeedFileData>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (seedData?.Lessons == null)
                {
                    result.Messages.Add($"Skipping {Path.GetFileName(file)}: no lessons found.");
                    continue;
                }

                // Check if lessons already exist for this level+module
                var firstLesson = seedData.Lessons.FirstOrDefault();
                if (firstLesson != null)
                {
                    var existing = await _lessonRepository.GetByModuleAsync(firstLesson.ModuleId);
                    if (existing.Count > 0)
                    {
                        result.Messages.Add($"Skipping {Path.GetFileName(file)}: lessons for module {firstLesson.ModuleId} already exist ({existing.Count} found).");
                        result.Skipped += existing.Count;
                        continue;
                    }
                }

                // Import lessons
                foreach (var lesson in seedData.Lessons)
                {
                    await _lessonRepository.CreateAsync(lesson);
                    result.Imported++;
                }

                result.Messages.Add($"Imported {seedData.Lessons.Count} lessons from {Path.GetFileName(file)}.");

                // Import tests from seed file if present
                if (seedData.Tests != null && seedData.Tests.Count > 0)
                {
                    foreach (var test in seedData.Tests)
                    {
                        await _testRepository.CreateAsync(test);
                        result.TestsImported++;
                    }
                    result.Messages.Add($"Imported {seedData.Tests.Count} tests from {Path.GetFileName(file)}.");
                }
            }
            catch (Exception ex)
            {
                result.Messages.Add($"Error processing {Path.GetFileName(file)}: {ex.Message}");
            }
        }

        return result;
    }

    public async Task<SeedResult> SeedFileAsync(string fileName)
    {
        var result = new SeedResult();
        var filePath = Path.Combine(_seedDataPath, fileName);

        if (!File.Exists(filePath))
        {
            result.Messages.Add($"File not found: {fileName}");
            return result;
        }

        try
        {
            var json = await File.ReadAllTextAsync(filePath);
            var seedData = JsonSerializer.Deserialize<SeedFileData>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (seedData?.Lessons == null)
            {
                result.Messages.Add("No lessons found in file.");
                return result;
            }

            foreach (var lesson in seedData.Lessons)
            {
                await _lessonRepository.CreateAsync(lesson);
                result.Imported++;
            }

            result.Messages.Add($"Imported {seedData.Lessons.Count} lessons from {fileName}.");
        }
        catch (Exception ex)
        {
            result.Messages.Add($"Error: {ex.Message}");
        }

        return result;
    }
}

public class SeedFileData
{
    public List<Lesson>? Lessons { get; set; }
    public List<ModuleTest>? Tests { get; set; }
}

public class SeedResult
{
    public int Imported { get; set; }
    public int TestsImported { get; set; }
    public int Skipped { get; set; }
    public List<string> Messages { get; set; } = new();
}
