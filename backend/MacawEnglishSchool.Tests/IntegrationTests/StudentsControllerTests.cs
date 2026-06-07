using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using MacawEnglishSchool.API.Models;
using Moq;

namespace MacawEnglishSchool.Tests.IntegrationTests;

public class StudentsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public StudentsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // ── GET /api/students ──

    [Fact]
    public async Task GetAll_WhenStudentsExist_ReturnsOkWithList()
    {
        // Arrange
        var students = new List<Student>
        {
            new() { Id = "1", Name = "Alice", Email = "alice@example.com", Phone = "123" },
            new() { Id = "2", Name = "Bob", Email = "bob@example.com", Phone = "456" }
        };

        _factory.StudentRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(students);

        // Act
        var response = await _client.GetAsync("/api/students");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<List<Student>>();
        result.Should().NotBeNull();
        result!.Count.Should().Be(2);
        result[0].Name.Should().Be("Alice");
    }

    // ── GET /api/students/{id} ──

    [Fact]
    public async Task GetById_WithExistingId_ReturnsOk()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.GetByIdAsync("student-1"))
            .ReturnsAsync(new Student { Id = "student-1", Name = "Charlie", Email = "charlie@test.com" });

        // Act
        var response = await _client.GetAsync("/api/students/student-1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var student = await response.Content.ReadFromJsonAsync<Student>();
        student.Should().NotBeNull();
        student!.Name.Should().Be("Charlie");
    }

    [Fact]
    public async Task GetById_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Student?)null);

        // Act
        var response = await _client.GetAsync("/api/students/non-existent");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST /api/students ──

    [Fact]
    public async Task Create_WithValidStudent_ReturnsCreated()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Student>()))
            .Returns(Task.CompletedTask);

        var newStudent = new Student
        {
            Name = "Diana",
            Email = "diana@test.com",
            Phone = "999-8888"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/students", newStudent);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await response.Content.ReadFromJsonAsync<Student>();
        created.Should().NotBeNull();
        created!.Name.Should().Be("Diana");
        created.Id.Should().NotBeNullOrEmpty();
    }

    // ── PUT /api/students/{id} ──

    [Fact]
    public async Task Update_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.GetByIdAsync("student-1"))
            .ReturnsAsync(new Student { Id = "student-1", Name = "Old Name" });

        _factory.StudentRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<Student>()))
            .Returns(Task.CompletedTask);

        var updated = new Student { Name = "New Name", Email = "new@test.com", Phone = "111" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/students/student-1", updated);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Update_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Student?)null);

        var updated = new Student { Name = "Nope", Email = "nope@test.com", Phone = "000" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/students/non-existent", updated);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── DELETE /api/students/{id} ──

    [Fact]
    public async Task Delete_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.GetByIdAsync("student-1"))
            .ReturnsAsync(new Student { Id = "student-1" });

        _factory.StudentRepositoryMock
            .Setup(r => r.DeleteAsync(It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        // Act
        var response = await _client.DeleteAsync("/api/students/student-1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.StudentRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Student?)null);

        // Act
        var response = await _client.DeleteAsync("/api/students/non-existent");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
