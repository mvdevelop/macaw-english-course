using MongoDB.Driver;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Repositories;

public interface IModuleTestRepository
{
    Task<List<ModuleTest>> GetAllAsync();
    Task<List<ModuleTest>> GetByLevelAsync(string levelCode);
    Task<List<ModuleTest>> GetByModuleAsync(string moduleId);
    Task<ModuleTest?> GetByIdAsync(string id);
    Task CreateAsync(ModuleTest test);
    Task UpdateAsync(string id, ModuleTest test);
    Task DeleteAsync(string id);
}

public interface ITestResultRepository
{
    Task<List<TestResult>> GetAllAsync();
    Task<List<TestResult>> GetByStudentAsync(string studentId);
    Task<TestResult?> GetByIdAsync(string id);
    Task<TestResult?> GetLatestByStudentAndTestAsync(string studentId, string testId);
    Task CreateAsync(TestResult result);
}

public interface IProgressRepository
{
    Task<StudentProgress?> GetByStudentAndLevelAsync(string studentId, string levelCode);
    Task<List<StudentProgress>> GetByStudentAsync(string studentId);
    Task CreateAsync(StudentProgress progress);
    Task UpdateAsync(string id, StudentProgress progress);
    Task DeleteAsync(string id);
}

// ── ModuleTest Repository ──
public class ModuleTestRepository : IModuleTestRepository
{
    private readonly IMongoCollection<ModuleTest> _collection;

    public ModuleTestRepository(MongoDbService mongoDbService) =>
        _collection = mongoDbService.GetCollection<ModuleTest>("moduleTests");

    public async Task<List<ModuleTest>> GetAllAsync() =>
        await _collection.Find(_ => true).ToListAsync();

    public async Task<List<ModuleTest>> GetByLevelAsync(string levelCode) =>
        await _collection.Find(t => t.LevelCode == levelCode).ToListAsync();

    public async Task<List<ModuleTest>> GetByModuleAsync(string moduleId) =>
        await _collection.Find(t => t.ModuleId == moduleId).ToListAsync();

    public async Task<ModuleTest?> GetByIdAsync(string id) =>
        await _collection.Find(t => t.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(ModuleTest test)
    {
        test.CreatedAt = DateTime.UtcNow;
        test.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(test);
    }

    public async Task UpdateAsync(string id, ModuleTest test)
    {
        test.UpdatedAt = DateTime.UtcNow;
        await _collection.ReplaceOneAsync(t => t.Id == id, test);
    }

    public async Task DeleteAsync(string id) =>
        await _collection.DeleteOneAsync(t => t.Id == id);
}

// ── TestResult Repository ──
public class TestResultRepository : ITestResultRepository
{
    private readonly IMongoCollection<TestResult> _collection;

    public TestResultRepository(MongoDbService mongoDbService) =>
        _collection = mongoDbService.GetCollection<TestResult>("testResults");

    public async Task<List<TestResult>> GetAllAsync() =>
        await _collection.Find(_ => true).ToListAsync();

    public async Task<List<TestResult>> GetByStudentAsync(string studentId) =>
        await _collection.Find(r => r.StudentId == studentId).ToListAsync();

    public async Task<TestResult?> GetByIdAsync(string id) =>
        await _collection.Find(r => r.Id == id).FirstOrDefaultAsync();

    public async Task<TestResult?> GetLatestByStudentAndTestAsync(string studentId, string testId) =>
        await _collection.Find(r => r.StudentId == studentId && r.TestId == testId)
            .SortByDescending(r => r.SubmittedAt)
            .FirstOrDefaultAsync();

    public async Task CreateAsync(TestResult result) =>
        await _collection.InsertOneAsync(result);
}

// ── Progress Repository ──
public class ProgressRepository : IProgressRepository
{
    private readonly IMongoCollection<StudentProgress> _collection;

    public ProgressRepository(MongoDbService mongoDbService) =>
        _collection = mongoDbService.GetCollection<StudentProgress>("studentProgress");

    public async Task<StudentProgress?> GetByStudentAndLevelAsync(string studentId, string levelCode) =>
        await _collection.Find(p => p.StudentId == studentId && p.LevelCode == levelCode).FirstOrDefaultAsync();

    public async Task<List<StudentProgress>> GetByStudentAsync(string studentId) =>
        await _collection.Find(p => p.StudentId == studentId).ToListAsync();

    public async Task CreateAsync(StudentProgress progress) =>
        await _collection.InsertOneAsync(progress);

    public async Task UpdateAsync(string id, StudentProgress progress)
    {
        progress.UpdatedAt = DateTime.UtcNow;
        await _collection.ReplaceOneAsync(p => p.Id == id, progress);
    }

    public async Task DeleteAsync(string id) =>
        await _collection.DeleteOneAsync(p => p.Id == id);
}
