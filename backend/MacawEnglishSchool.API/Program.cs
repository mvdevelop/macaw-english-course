using MacawEnglishSchool.API.Services;
using MacawEnglishSchool.API.Settings;
using MacawEnglishSchool.API.Repositories;
using MacawEnglishSchool.API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// Configure MongoDB
var mongoDbSettings = new MongoDbSettings();
builder.Configuration.GetSection("MongoDb").Bind(mongoDbSettings);

// Log connection status at startup (safe - only logs whether it's configured, not the value)
if (string.IsNullOrWhiteSpace(mongoDbSettings.ConnectionString))
{
    throw new InvalidOperationException("MongoDb ConnectionString is not configured. Set the MongoDb__ConnectionString environment variable.");
}
if (string.IsNullOrWhiteSpace(mongoDbSettings.DatabaseName))
{
    throw new InvalidOperationException("MongoDb DatabaseName is not configured. Set the MongoDb__DatabaseName environment variable.");
}

builder.Services.AddSingleton(mongoDbSettings);
builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddHttpClient();

// Register Repositories
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILessonRepository, LessonRepository>();
builder.Services.AddScoped<IModuleTestRepository, ModuleTestRepository>();
builder.Services.AddScoped<ITestResultRepository, TestResultRepository>();
builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
builder.Services.AddScoped<SeedService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Use custom middlewares
app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Welcome route
app.MapGet("/", () => Results.Ok(new
{
    message = "Welcome to Macaw English School API!",
    version = "1.0.0",
    status = "running"
}));

app.MapControllers();

app.Run();

