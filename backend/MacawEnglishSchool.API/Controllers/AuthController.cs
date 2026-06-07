using Microsoft.AspNetCore.Mvc;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;

namespace MacawEnglishSchool.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public AuthController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<User>> Signup([FromBody] SignupRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Email and password are required");

        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest("Email already registered");

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name ?? "User",
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        };

        await _userRepository.CreateAsync(user);
        return CreatedAtAction(nameof(Signup), new { id = user.Id }, user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Email and password are required");

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password");

        return Ok(new LoginResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Message = "Login successful"
        });
    }

    [HttpGet("user/{id}")]
    public async Task<ActionResult<User>> GetUser(string id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return NotFound("User not found");
        return Ok(new LoginResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Message = "User found"
        });
    }

    [HttpPut("user/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return NotFound("User not found");

        if (!string.IsNullOrWhiteSpace(request.Name))
            user.Name = request.Name;

        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(id, user);
        return Ok(new LoginResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Message = "User updated successfully"
        });
    }
}

public class SignupRequest
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginResponse
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Message { get; set; } = null!;
}

public class UpdateUserRequest
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
}
