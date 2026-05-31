using MongoDB.Driver;
using MacawEnglishSchool.API.Settings;

namespace MacawEnglishSchool.API.Services;

public class MongoDbService
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;

    public MongoDbService(MongoDbSettings settings)
    {
        _client = new MongoClient(settings.ConnectionString);
        _database = _client.GetDatabase(settings.DatabaseName);
    }

    public IMongoDatabase GetDatabase() => _database;

    public IMongoCollection<T> GetCollection<T>(string collectionName) =>
        _database.GetCollection<T>(collectionName);
}
