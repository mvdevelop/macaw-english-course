using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using MacawEnglishSchool.API.Models;
using Moq;

namespace MacawEnglishSchool.Tests.IntegrationTests;

public class CoursesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public CoursesControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // ── GET /api/courses ──

    [Fact]
    public async Task GetAll_WhenCoursesExist_ReturnsOkWithList()
    {
        // Arrange
        var courses = new List<Course>
        {
            new() { Id = "1", Name = "English A1", Description = "Beginner", Level = 1 },
            new() { Id = "2", Name = "English A2", Description = "Elementary", Level = 2 }
        };

        _factory.CourseRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(courses);

        // Act
        var response = await _client.GetAsync("/api/courses");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<List<Course>>();
        result.Should().NotBeNull();
        result!.Count.Should().Be(2);
        result[0].Name.Should().Be("English A1");
    }

    [Fact]
    public async Task GetAll_WhenNoCourses_ReturnsEmptyList()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<Course>());

        // Act
        var response = await _client.GetAsync("/api/courses");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<List<Course>>();
        result.Should().NotBeNull();
        result!.Should().BeEmpty();
    }

    // ── GET /api/courses/{id} ──

    [Fact]
    public async Task GetById_WithExistingId_ReturnsOk()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetByIdAsync("course-1"))
            .ReturnsAsync(new Course { Id = "course-1", Name = "English B1", Level = 3 });

        // Act
        var response = await _client.GetAsync("/api/courses/course-1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var course = await response.Content.ReadFromJsonAsync<Course>();
        course.Should().NotBeNull();
        course!.Name.Should().Be("English B1");
    }

    [Fact]
    public async Task GetById_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        // Act
        var response = await _client.GetAsync("/api/courses/non-existent");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST /api/courses ──

    [Fact]
    public async Task Create_WithValidCourse_ReturnsCreated()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Course>()))
            .Returns(Task.CompletedTask);

        var newCourse = new Course
        {
            Name = "English C1",
            Description = "Advanced",
            Level = 5
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/courses", newCourse);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await response.Content.ReadFromJsonAsync<Course>();
        created.Should().NotBeNull();
        created!.Name.Should().Be("English C1");
        created.Id.Should().NotBeNullOrEmpty();
    }

    // ── PUT /api/courses/{id} ──

    [Fact]
    public async Task Update_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetByIdAsync("course-1"))
            .ReturnsAsync(new Course { Id = "course-1", Name = "Old Name" });

        _factory.CourseRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<Course>()))
            .Returns(Task.CompletedTask);

        var updatedCourse = new Course { Name = "Updated Course", Description = "Updated", Level = 2 };

        // Act
        var response = await _client.PutAsJsonAsync("/api/courses/course-1", updatedCourse);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Update_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        var updatedCourse = new Course { Name = "Nope", Description = "Nope", Level = 1 };

        // Act
        var response = await _client.PutAsJsonAsync("/api/courses/non-existent", updatedCourse);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── DELETE /api/courses/{id} ──

    [Fact]
    public async Task Delete_WithExistingId_ReturnsNoContent()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetByIdAsync("course-1"))
            .ReturnsAsync(new Course { Id = "course-1", Name = "To Delete" });

        _factory.CourseRepositoryMock
            .Setup(r => r.DeleteAsync(It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        // Act
        var response = await _client.DeleteAsync("/api/courses/course-1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        _factory.CourseRepositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        // Act
        var response = await _client.DeleteAsync("/api/courses/non-existent");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
