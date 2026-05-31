using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly IProgressRepository _progressRepository;
    private readonly ILessonRepository _lessonRepository;

    public ProgressController(IProgressRepository progressRepository, ILessonRepository lessonRepository)
    {
        _progressRepository = progressRepository;
        _lessonRepository = lessonRepository;
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<List<StudentProgress>>> GetByStudent(string studentId) =>
        Ok(await _progressRepository.GetByStudentAsync(studentId));

    [HttpGet("student/{studentId}/level/{levelCode}")]
    public async Task<ActionResult<StudentProgress>> GetByStudentAndLevel(string studentId, string levelCode)
    {
        var progress = await _progressRepository.GetByStudentAndLevelAsync(studentId, levelCode);
        if (progress == null) return NotFound("Progress not found for this level.");
        return Ok(progress);
    }

    [HttpPost]
    public async Task<ActionResult<StudentProgress>> Create(StudentProgress progress)
    {
        // Calculate initial progress
        progress.OverallProgress = 0;
        progress.StartedAt = DateTime.UtcNow;
        progress.UpdatedAt = DateTime.UtcNow;
        await _progressRepository.CreateAsync(progress);
        return Created("", progress);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, StudentProgress progress)
    {
        var existing = await _progressRepository.GetByStudentAndLevelAsync(progress.StudentId, progress.LevelCode);

        if (existing == null) return NotFound();

        progress.Id = existing.Id;
        progress.StartedAt = existing.StartedAt;
        progress.UpdatedAt = DateTime.UtcNow;

        // Auto-calculate overall progress
        await RecalculateProgress(progress);

        await _progressRepository.UpdateAsync(id, progress);
        return NoContent();
    }

    // Helper endpoint to mark lesson complete
    [HttpPost("complete-lesson")]
    public async Task<ActionResult<StudentProgress>> CompleteLesson([FromBody] CompleteLessonRequest request)
    {
        var progress = await _progressRepository.GetByStudentAndLevelAsync(request.StudentId, request.LevelCode);

        if (progress == null)
        {
            progress = new StudentProgress
            {
                StudentId = request.StudentId,
                LevelCode = request.LevelCode,
                CompletedLessons = new List<string> { request.LessonId },
                StartedAt = DateTime.UtcNow
            };
            await _progressRepository.CreateAsync(progress);
        }
        else
        {
            if (!progress.CompletedLessons.Contains(request.LessonId))
            {
                progress.CompletedLessons.Add(request.LessonId);
            }
        }

        // Record exercise score
        if (request.Score > 0)
        {
            var existing = progress.ExerciseScores.FirstOrDefault(e => e.LessonId == request.LessonId);
            if (existing != null)
            {
                existing.Score = request.Score;
                existing.Total = request.Total;
                existing.Attempts++;
            }
            else
            {
                progress.ExerciseScores.Add(new LessonExerciseScore
                {
                    LessonId = request.LessonId,
                    Score = request.Score,
                    Total = request.Total,
                    Attempts = 1
                });
            }
        }

        await RecalculateProgress(progress);

        // If it was newly created, re-fetch to get the generated ID
        var toUpdate = await _progressRepository.GetByStudentAndLevelAsync(progress.StudentId, progress.LevelCode);
        if (toUpdate != null)
        {
            toUpdate.CompletedLessons = progress.CompletedLessons;
            toUpdate.ExerciseScores = progress.ExerciseScores;
            toUpdate.CurrentModuleId = progress.CurrentModuleId;
            toUpdate.OverallProgress = progress.OverallProgress;
            toUpdate.CompletedAt = progress.CompletedAt;
            toUpdate.UpdatedAt = DateTime.UtcNow;
            await _progressRepository.UpdateAsync(toUpdate.Id!, toUpdate);
            return Ok(toUpdate);
        }

        return Ok(progress);
    }

    private async Task RecalculateProgress(StudentProgress progress)
    {
        var allLessons = await _lessonRepository.GetByLevelAsync(progress.LevelCode);
        var totalLessons = allLessons.Count;
        if (totalLessons == 0) return;

        progress.OverallProgress = Math.Round(
            (progress.CompletedLessons.Count * 100.0) / totalLessons, 1);

        if (progress.OverallProgress >= 100)
        {
            progress.CompletedAt = DateTime.UtcNow;
        }
    }
}

public class CompleteLessonRequest
{
    public string StudentId { get; set; } = string.Empty;
    public string LevelCode { get; set; } = string.Empty;
    public string LessonId { get; set; } = string.Empty;
    public int Score { get; set; }
    public int Total { get; set; }
}
