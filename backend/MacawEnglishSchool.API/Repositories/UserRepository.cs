using MongoDB.Driver;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Repositories;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task CreateAsync(User user);
    Task UpdateAsync(string id, User user);
    Task DeleteAsync(string id);
}

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _collection;

    public UserRepository(MongoDbService mongoDbService)
    {
        _collection = mongoDbService.GetCollection<User>("users");
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _collection.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(User user)
    {
        await _collection.InsertOneAsync(user);
    }

    public async Task UpdateAsync(string id, User user)
    {
        await _collection.ReplaceOneAsync(u => u.Id == id, user);
    }

    public async Task DeleteAsync(string id)
    {
        await _collection.DeleteOneAsync(u => u.Id == id);
    }
}
