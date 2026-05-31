using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentRepository _repository;

    public StudentsController(IStudentRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Student>>> GetAll()
    {
        var students = await _repository.GetAllAsync();
        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Student>> GetById(string id)
    {
        var student = await _repository.GetByIdAsync(id);
        if (student == null)
            return NotFound();
        return Ok(student);
    }

    [HttpPost]
    public async Task<ActionResult<Student>> Create(Student student)
    {
        student.Id = Guid.NewGuid().ToString();
        await _repository.CreateAsync(student);
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Student student)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return NotFound();

        student.Id = id;
        student.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(id, student);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var student = await _repository.GetByIdAsync(id);
        if (student == null)
            return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
