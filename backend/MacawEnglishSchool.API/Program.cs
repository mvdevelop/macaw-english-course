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
builder.Services.AddSingleton(mongoDbSettings);
builder.Services.AddSingleton<MongoDbService>();

// Register Repositories
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use custom middlewares
app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.MapControllers();

app.Run();

