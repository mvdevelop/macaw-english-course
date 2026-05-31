using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly ILessonRepository _repository;

    public LessonsController(ILessonRepository repository) => _repository = repository;

    [HttpGet]
    public async Task<ActionResult<List<Lesson>>> GetAll() =>
        Ok(await _repository.GetAllAsync());

    [HttpGet("level/{levelCode}")]
    public async Task<ActionResult<List<Lesson>>> GetByLevel(string levelCode)
    {
        var lessons = await _repository.GetByLevelAsync(levelCode);
        return Ok(lessons);
    }

    [HttpGet("module/{moduleId}")]
    public async Task<ActionResult<List<Lesson>>> GetByModule(string moduleId) =>
        Ok(await _repository.GetByModuleAsync(moduleId));

    [HttpGet("{id}")]
    public async Task<ActionResult<Lesson>> GetById(string id)
    {
        var lesson = await _repository.GetByIdAsync(id);
        if (lesson == null) return NotFound();
        return Ok(lesson);
    }

    [HttpPost]
    public async Task<ActionResult<Lesson>> Create(Lesson lesson)
    {
        lesson.Id = null; // Let MongoDB generate
        await _repository.CreateAsync(lesson);
        return CreatedAtAction(nameof(GetById), new { id = lesson.Id }, lesson);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Lesson lesson)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repository.UpdateAsync(id, lesson);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
