using MongoDB.Driver;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Repositories;

public interface ICourseRepository
{
    Task<List<Course>> GetAllAsync();
    Task<Course?> GetByIdAsync(string id);
    Task CreateAsync(Course course);
    Task UpdateAsync(string id, Course course);
    Task DeleteAsync(string id);
}

public class CourseRepository : ICourseRepository
{
    private readonly IMongoCollection<Course> _collection;

    public CourseRepository(MongoDbService mongoDbService)
    {
        _collection = mongoDbService.GetCollection<Course>("courses");
    }

    public async Task<List<Course>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(string id)
    {
        return await _collection.Find(c => c.Id == id).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Course course)
    {
        await _collection.InsertOneAsync(course);
    }

    public async Task UpdateAsync(string id, Course course)
    {
        await _collection.ReplaceOneAsync(c => c.Id == id, course);
    }

    public async Task DeleteAsync(string id)
    {
        await _collection.DeleteOneAsync(c => c.Id == id);
    }
}
