using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMessageRepository _messageRepository;

    public MessagesController(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    [HttpGet("conversations/{userId}")]
    public async Task<ActionResult<List<Conversation>>> GetConversations(string userId)
    {
        return Ok(await _messageRepository.GetConversationsAsync(userId));
    }

    [HttpGet("conversation/{userId1}/{userId2}")]
    public async Task<ActionResult<List<Message>>> GetConversation(string userId1, string userId2)
    {
        return Ok(await _messageRepository.GetConversationAsync(userId1, userId2));
    }

    [HttpPost("send")]
    public async Task<ActionResult<Message>> Send([FromBody] SendMessageRequest request)
    {
        var message = new Message
        {
            SenderId = request.SenderId,
            SenderName = request.SenderName,
            ReceiverId = request.ReceiverId,
            ReceiverName = request.ReceiverName,
            Text = request.Text,
        };

        var sent = await _messageRepository.SendAsync(message);
        return Created("", sent);
    }

    [HttpPut("read/{messageId}")]
    public async Task<IActionResult> MarkAsRead(string messageId)
    {
        await _messageRepository.MarkAsReadAsync(messageId);
        return NoContent();
    }

    [HttpGet("unread/{userId}")]
    public async Task<ActionResult<int>> GetUnreadCount(string userId)
    {
        return Ok(await _messageRepository.GetUnreadCountAsync(userId));
    }
}
