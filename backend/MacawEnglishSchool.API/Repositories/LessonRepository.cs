using MongoDB.Driver;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Repositories;

public interface ILessonRepository
{
    Task<List<Lesson>> GetAllAsync();
    Task<List<Lesson>> GetByLevelAsync(string levelCode);
    Task<List<Lesson>> GetByModuleAsync(string moduleId);
    Task<Lesson?> GetByIdAsync(string id);
    Task CreateAsync(Lesson lesson);
    Task UpdateAsync(string id, Lesson lesson);
    Task DeleteAsync(string id);
}

public class LessonRepository : ILessonRepository
{
    private readonly IMongoCollection<Lesson> _collection;

    public LessonRepository(MongoDbService mongoDbService)
    {
        _collection = mongoDbService.GetCollection<Lesson>("lessons");
    }

    public async Task<List<Lesson>> GetAllAsync() =>
        await _collection.Find(_ => true).SortBy(l => l.LevelCode).ThenBy(l => l.Order).ToListAsync();

    public async Task<List<Lesson>> GetByLevelAsync(string levelCode) =>
        await _collection.Find(l => l.LevelCode == levelCode).SortBy(l => l.Order).ToListAsync();

    public async Task<List<Lesson>> GetByModuleAsync(string moduleId) =>
        await _collection.Find(l => l.ModuleId == moduleId).SortBy(l => l.Order).ToListAsync();

    public async Task<Lesson?> GetByIdAsync(string id) =>
        await _collection.Find(l => l.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Lesson lesson)
    {
        lesson.CreatedAt = DateTime.UtcNow;
        lesson.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(lesson);
    }

    public async Task UpdateAsync(string id, Lesson lesson)
    {
        lesson.UpdatedAt = DateTime.UtcNow;
        await _collection.ReplaceOneAsync(l => l.Id == id, lesson);
    }

    public async Task DeleteAsync(string id) =>
        await _collection.DeleteOneAsync(l => l.Id == id);
}
