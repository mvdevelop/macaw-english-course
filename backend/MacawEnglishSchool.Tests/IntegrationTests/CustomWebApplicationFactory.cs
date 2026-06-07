using MacawEnglishSchool.API.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace MacawEnglishSchool.Tests.IntegrationTests;

/// <summary>
/// Custom WebApplicationFactory that replaces MongoDB repositories
/// with mock implementations for integration testing.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    // Expose mocks so tests can configure return values
    public Mock<ICourseRepository> CourseRepositoryMock { get; } = new();
    public Mock<IStudentRepository> StudentRepositoryMock { get; } = new();
    public Mock<IUserRepository> UserRepositoryMock { get; } = new();
    public Mock<ILessonRepository> LessonRepositoryMock { get; } = new();
    public Mock<IModuleTestRepository> ModuleTestRepositoryMock { get; } = new();
    public Mock<ITestResultRepository> TestResultRepositoryMock { get; } = new();
    public Mock<IProgressRepository> ProgressRepositoryMock { get; } = new();
    public Mock<IMessageRepository> MessageRepositoryMock { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Provide dummy MongoDB config so the API startup doesn't throw
        builder.UseSetting("MongoDb:ConnectionString", "mongodb://localhost:27017/test");
        builder.UseSetting("MongoDb:DatabaseName", "test_db");
        builder.UseSetting("Gemini:ApiKey", "test-key");

        builder.ConfigureServices(services =>
        {
            // Remove real MongoDB service (prevents actual connection attempts)
            RemoveService<API.Services.MongoDbService>(services);

            // Remove all real repository registrations
            RemoveService<ICourseRepository>(services);
            RemoveService<IStudentRepository>(services);
            RemoveService<IUserRepository>(services);
            RemoveService<ILessonRepository>(services);
            RemoveService<IModuleTestRepository>(services);
            RemoveService<ITestResultRepository>(services);
            RemoveService<IProgressRepository>(services);
            RemoveService<IMessageRepository>(services);

            // Register mock repositories
            services.AddScoped<ICourseRepository>(_ => CourseRepositoryMock.Object);
            services.AddScoped<IStudentRepository>(_ => StudentRepositoryMock.Object);
            services.AddScoped<IUserRepository>(_ => UserRepositoryMock.Object);
            services.AddScoped<ILessonRepository>(_ => LessonRepositoryMock.Object);
            services.AddScoped<IModuleTestRepository>(_ => ModuleTestRepositoryMock.Object);
            services.AddScoped<ITestResultRepository>(_ => TestResultRepositoryMock.Object);
            services.AddScoped<IProgressRepository>(_ => ProgressRepositoryMock.Object);
            services.AddScoped<IMessageRepository>(_ => MessageRepositoryMock.Object);
        });
    }

    private static void RemoveService<T>(IServiceCollection services)
    {
        var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(T));
        if (descriptor != null)
            services.Remove(descriptor);
    }
}
