using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestsController : ControllerBase
{
    private readonly IModuleTestRepository _testRepository;
    private readonly ITestResultRepository _resultRepository;

    public TestsController(IModuleTestRepository testRepository, ITestResultRepository resultRepository)
    {
        _testRepository = testRepository;
        _resultRepository = resultRepository;
    }

    // ── Module Tests ──
    [HttpGet]
    public async Task<ActionResult<List<ModuleTest>>> GetAll() =>
        Ok(await _testRepository.GetAllAsync());

    [HttpGet("level/{levelCode}")]
    public async Task<ActionResult<List<ModuleTest>>> GetByLevel(string levelCode) =>
        Ok(await _testRepository.GetByLevelAsync(levelCode));

    [HttpGet("module/{moduleId}")]
    public async Task<ActionResult<ModuleTest>> GetByModule(string moduleId)
    {
        var tests = await _testRepository.GetByModuleAsync(moduleId);
        return Ok(tests.FirstOrDefault());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ModuleTest>> GetById(string id)
    {
        var test = await _testRepository.GetByIdAsync(id);
        if (test == null) return NotFound();
        return Ok(test);
    }

    [HttpPost]
    public async Task<ActionResult<ModuleTest>> Create(ModuleTest test)
    {
        test.Id = null;
        await _testRepository.CreateAsync(test);
        return CreatedAtAction(nameof(GetById), new { id = test.Id }, test);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, ModuleTest test)
    {
        var existing = await _testRepository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _testRepository.UpdateAsync(id, test);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _testRepository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _testRepository.DeleteAsync(id);
        return NoContent();
    }

    // ── Test Results ──
    [HttpPost("results")]
    public async Task<ActionResult<TestResult>> SubmitResult(TestResult result)
    {
        // Auto-grade
        var test = await _testRepository.GetByIdAsync(result.TestId);
        if (test == null) return BadRequest("Test not found");

        int correct = 0;
        foreach (var answer in result.Answers)
        {
            var question = test.Questions.FirstOrDefault(q => q.Order == answer.QuestionOrder);
            if (question != null)
            {
                answer.IsCorrect = question.CorrectAnswer == answer.SelectedAnswer;
                if (answer.IsCorrect) correct++;
            }
        }

        result.TotalQuestions = test.Questions.Count;
        result.CorrectAnswers = correct;
        result.Score = test.Questions.Count > 0 ? (correct * 100) / test.Questions.Count : 0;
        result.Passed = result.Score >= test.PassingScore;
        result.SubmittedAt = DateTime.UtcNow;

        await _resultRepository.CreateAsync(result);
        return CreatedAtAction(nameof(GetResult), new { id = result.Id }, result);
    }

    [HttpGet("results/{id}")]
    public async Task<ActionResult<TestResult>> GetResult(string id)
    {
        var result = await _resultRepository.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("results/student/{studentId}")]
    public async Task<ActionResult<List<TestResult>>> GetByStudent(string studentId) =>
        Ok(await _resultRepository.GetByStudentAsync(studentId));
}
