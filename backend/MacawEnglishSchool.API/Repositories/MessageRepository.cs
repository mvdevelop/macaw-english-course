using MongoDB.Driver;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Services;

namespace MacawEnglishSchool.API.Repositories;

public interface IMessageRepository
{
    Task<List<Message>> GetConversationAsync(string userId1, string userId2);
    Task<List<Conversation>> GetConversationsAsync(string userId);
    Task<Message> SendAsync(Message message);
    Task MarkAsReadAsync(string messageId);
    Task<int> GetUnreadCountAsync(string userId);
}

public class MessageRepository : IMessageRepository
{
    private readonly IMongoCollection<Message> _collection;

    public MessageRepository(MongoDbService mongoDbService)
    {
        _collection = mongoDbService.GetCollection<Message>("messages");
    }

    public async Task<List<Message>> GetConversationAsync(string userId1, string userId2)
    {
        var filter = Builders<Message>.Filter.Or(
            Builders<Message>.Filter.And(
                Builders<Message>.Filter.Eq(m => m.SenderId, userId1),
                Builders<Message>.Filter.Eq(m => m.ReceiverId, userId2)),
            Builders<Message>.Filter.And(
                Builders<Message>.Filter.Eq(m => m.SenderId, userId2),
                Builders<Message>.Filter.Eq(m => m.ReceiverId, userId1))
        );

        return await _collection.Find(filter)
            .SortBy(m => m.SentAt)
            .ToListAsync();
    }

    public async Task<List<Conversation>> GetConversationsAsync(string userId)
    {
        var filter = Builders<Message>.Filter.Or(
            Builders<Message>.Filter.Eq(m => m.SenderId, userId),
            Builders<Message>.Filter.Eq(m => m.ReceiverId, userId)
        );

        var messages = await _collection.Find(filter)
            .SortByDescending(m => m.SentAt)
            .ToListAsync();

        var conversations = messages
            .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Select(g =>
            {
                var last = g.First();
                var isMe = last.SenderId == userId;
                return new Conversation
                {
                    UserId = isMe ? last.ReceiverId : last.SenderId,
                    UserName = isMe ? last.ReceiverName : last.SenderName,
                    LastMessage = last.Text,
                    LastMessageAt = last.SentAt,
                    UnreadCount = g.Count(m => m.ReceiverId == userId && !m.IsRead)
                };
            })
            .OrderByDescending(c => c.LastMessageAt)
            .ToList();

        return conversations;
    }

    public async Task<Message> SendAsync(Message message)
    {
        if (string.IsNullOrEmpty(message.Id))
            message.Id = Guid.NewGuid().ToString();
        message.SentAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(message);
        return message;
    }

    public async Task MarkAsReadAsync(string messageId)
    {
        var update = Builders<Message>.Update.Set(m => m.IsRead, true);
        await _collection.UpdateOneAsync(m => m.Id == messageId, update);
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        var filter = Builders<Message>.Filter.And(
            Builders<Message>.Filter.Eq(m => m.ReceiverId, userId),
            Builders<Message>.Filter.Eq(m => m.IsRead, false)
        );
        return (int)await _collection.CountDocumentsAsync(filter);
    }
}
