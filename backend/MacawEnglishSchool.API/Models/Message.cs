namespace MacawEnglishSchool.API.Models;

public class Message
{
    public string? Id { get; set; }
    public string SenderId { get; set; } = null!;
    public string SenderName { get; set; } = null!;
    public string ReceiverId { get; set; } = null!;
    public string ReceiverName { get; set; } = null!;
    public string Text { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    public string? SenderAvatar { get; set; }
}

public class SendMessageRequest
{
    public string SenderId { get; set; } = null!;
    public string SenderName { get; set; } = null!;
    public string ReceiverId { get; set; } = null!;
    public string ReceiverName { get; set; } = null!;
    public string Text { get; set; } = null!;
}

public class Conversation
{
    public string UserId { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
}
