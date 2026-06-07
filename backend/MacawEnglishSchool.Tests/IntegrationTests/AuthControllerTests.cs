using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using MacawEnglishSchool.API.Controllers;
using MacawEnglishSchool.API.Models;
using MacawEnglishSchool.API.Repositories;
using Moq;

namespace MacawEnglishSchool.Tests.IntegrationTests;

public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // ── POST /api/auth/signup ──

    [Fact]
    public async Task Signup_WithValidData_ReturnsCreated()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        _factory.UserRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        var request = new SignupRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Password = "SecurePass123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/signup", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var user = await response.Content.ReadFromJsonAsync<User>();
        user.Should().NotBeNull();
        user!.Email.Should().Be("john@example.com");
        user.Name.Should().Be("John Doe");
    }

    [Fact]
    public async Task Signup_WithMissingFields_ReturnsBadRequest()
    {
        // Arrange
        var request = new SignupRequest
        {
            Name = "John Doe",
            Email = "",
            Password = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/signup", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Signup_WithExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync("existing@example.com"))
            .ReturnsAsync(new User { Id = "1", Email = "existing@example.com" });

        var request = new SignupRequest
        {
            Name = "Jane Doe",
            Email = "existing@example.com",
            Password = "SecurePass123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/signup", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    // ── POST /api/auth/login ──

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOk()
    {
        // Arrange
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPass123");

        _factory.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync("valid@example.com"))
            .ReturnsAsync(new User
            {
                Id = "1",
                Name = "Valid User",
                Email = "valid@example.com",
                PasswordHash = passwordHash
            });

        var request = new LoginRequest
        {
            Email = "valid@example.com",
            Password = "CorrectPass123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        loginResponse.Should().NotBeNull();
        loginResponse!.Email.Should().Be("valid@example.com");
        loginResponse.Message.Should().Be("Login successful");
    }

    [Fact]
    public async Task Login_WithInvalidPassword_ReturnsUnauthorized()
    {
        // Arrange
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPass123");

        _factory.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync("valid@example.com"))
            .ReturnsAsync(new User
            {
                Id = "1",
                Name = "Valid User",
                Email = "valid@example.com",
                PasswordHash = passwordHash
            });

        var request = new LoginRequest
        {
            Email = "valid@example.com",
            Password = "WrongPassword"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_ReturnsUnauthorized()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var request = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "AnyPass123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_WithMissingFields_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoginRequest { Email = "", Password = "" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    // ── GET /api/auth/user/{id} ──

    [Fact]
    public async Task GetUser_WithExistingId_ReturnsOk()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByIdAsync("user-1"))
            .ReturnsAsync(new User
            {
                Id = "user-1",
                Name = "John Doe",
                Email = "john@example.com"
            });

        // Act
        var response = await _client.GetAsync("/api/auth/user/user-1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var user = await response.Content.ReadFromJsonAsync<LoginResponse>();
        user.Should().NotBeNull();
        user!.Name.Should().Be("John Doe");
    }

    [Fact]
    public async Task GetUser_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        // Act
        var response = await _client.GetAsync("/api/auth/user/non-existent");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── PUT /api/auth/user/{id} ──

    [Fact]
    public async Task UpdateUser_WithValidData_ReturnsOk()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByIdAsync("user-1"))
            .ReturnsAsync(new User { Id = "user-1", Name = "Old Name", Email = "old@example.com" });

        _factory.UserRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        var request = new UpdateUserRequest { Name = "New Name" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/auth/user/user-1", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var updated = await response.Content.ReadFromJsonAsync<LoginResponse>();
        updated.Should().NotBeNull();
        updated!.Message.Should().Be("User updated successfully");
    }

    [Fact]
    public async Task UpdateUser_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.UserRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var request = new UpdateUserRequest { Name = "New Name" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/auth/user/non-existent", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
