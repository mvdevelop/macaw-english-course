using MongoDB.Driver;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Repositories;

public interface IStudentRepository
{
    Task<List<Student>> GetAllAsync();
    Task<Student?> GetByIdAsync(string id);
    Task CreateAsync(Student student);
    Task UpdateAsync(string id, Student student);
    Task DeleteAsync(string id);
}

public class StudentRepository : IStudentRepository
{
    private readonly IMongoCollection<Student> _collection;

    public StudentRepository(MongoDbService mongoDbService)
    {
        _collection = mongoDbService.GetCollection<Student>("students");
    }

    public async Task<List<Student>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<Student?> GetByIdAsync(string id)
    {
        return await _collection.Find(s => s.Id == id).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Student student)
    {
        await _collection.InsertOneAsync(student);
    }

    public async Task UpdateAsync(string id, Student student)
    {
        await _collection.ReplaceOneAsync(s => s.Id == id, student);
    }

    public async Task DeleteAsync(string id)
    {
        await _collection.DeleteOneAsync(s => s.Id == id);
    }
}
