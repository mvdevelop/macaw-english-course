using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseRepository _repository;

    public CoursesController(ICourseRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Course>>> GetAll()
    {
        var courses = await _repository.GetAllAsync();
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetById(string id)
    {
        var course = await _repository.GetByIdAsync(id);
        if (course == null)
            return NotFound();
        return Ok(course);
    }

    [HttpPost]
    public async Task<ActionResult<Course>> Create(Course course)
    {
        course.Id = Guid.NewGuid().ToString();
        await _repository.CreateAsync(course);
        return CreatedAtAction(nameof(GetById), new { id = course.Id }, course);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Course course)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return NotFound();

        course.Id = id;
        course.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(id, course);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var course = await _repository.GetByIdAsync(id);
        if (course == null)
            return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
