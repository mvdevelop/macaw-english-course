namespace admin_blazor.Models
{
    // ── Auth ──
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class AdminUser
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // ── Course ──
    public class Course
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationWeeks { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // ── Student ──
    public class Student
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // ── Lesson ──
    public class Lesson
    {
        public string Id { get; set; } = string.Empty;
        public string LevelCode { get; set; } = string.Empty;
        public string ModuleId { get; set; } = string.Empty;
        public string ModuleTitle { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<ContentBlock> Content { get; set; } = new();
        public List<Exercise> Exercises { get; set; } = new();
        public int EstimatedMinutes { get; set; } = 30;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ContentBlock
    {
        public int Order { get; set; }
        public string Type { get; set; } = "text";
        public string Body { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? ImageUrl { get; set; }
        public string? Caption { get; set; }
        public string? AudioUrl { get; set; }
        public string? Transcript { get; set; }
        public string? VideoUrl { get; set; }
        public List<ReadingQuestion> Questions { get; set; } = new();
    }

    public class ReadingQuestion
    {
        public string Question { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new();
        public string CorrectAnswer { get; set; } = string.Empty;
    }

    public class Exercise
    {
        public int Order { get; set; }
        public string Type { get; set; } = "multiple-choice";
        public string Question { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new();
        public List<MatchPair> Pairs { get; set; } = new();
        public string CorrectAnswer { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
        public string? AudioUrl { get; set; }
        public string Difficulty { get; set; } = "easy";
    }

    public class MatchPair
    {
        public string Left { get; set; } = string.Empty;
        public string Right { get; set; } = string.Empty;
    }
}
