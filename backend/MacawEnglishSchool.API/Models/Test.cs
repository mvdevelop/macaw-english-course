using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MacawEnglishSchool.API.Models;

// ── Test Question ──
public class TestQuestion
{
    [BsonElement("order")]
    public int Order { get; set; }

    [BsonElement("type")]
    public string Type { get; set; } = "multiple-choice";

    [BsonElement("question")]
    public string Question { get; set; } = string.Empty;

    [BsonElement("context")]
    public string? Context { get; set; } // texto base estilo ENEM

    [BsonElement("options")]
    public List<string> Options { get; set; } = new();

    [BsonElement("correctAnswer")]
    public string CorrectAnswer { get; set; } = string.Empty;

    [BsonElement("explanation")]
    public string Explanation { get; set; } = string.Empty;

    [BsonElement("difficulty")]
    public string Difficulty { get; set; } = "medium";

    [BsonElement("skill")]
    public string Skill { get; set; } = "grammar"; // grammar, vocabulary, reading, listening, writing
}

// ── Module Test ──
public class ModuleTest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("levelCode")]
    public string LevelCode { get; set; } = string.Empty;

    [BsonElement("moduleId")]
    public string ModuleId { get; set; } = string.Empty;

    [BsonElement("moduleTitle")]
    public string ModuleTitle { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("questions")]
    public List<TestQuestion> Questions { get; set; } = new();

    [BsonElement("passingScore")]
    public int PassingScore { get; set; } = 70; // percentage

    [BsonElement("timeLimit")]
    public int TimeLimit { get; set; } = 45; // minutes

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// ── Test Result ──
public class TestResult
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("studentId")]
    public string StudentId { get; set; } = string.Empty;

    [BsonElement("testId")]
    public string TestId { get; set; } = string.Empty;

    [BsonElement("levelCode")]
    public string LevelCode { get; set; } = string.Empty;

    [BsonElement("moduleId")]
    public string ModuleId { get; set; } = string.Empty;

    [BsonElement("score")]
    public int Score { get; set; } // percentage

    [BsonElement("totalQuestions")]
    public int TotalQuestions { get; set; }

    [BsonElement("correctAnswers")]
    public int CorrectAnswers { get; set; }

    [BsonElement("passed")]
    public bool Passed { get; set; }

    [BsonElement("answers")]
    public List<TestAnswer> Answers { get; set; } = new();

    [BsonElement("startedAt")]
    public DateTime StartedAt { get; set; }

    [BsonElement("submittedAt")]
    public DateTime SubmittedAt { get; set; }
}

public class TestAnswer
{
    [BsonElement("questionOrder")]
    public int QuestionOrder { get; set; }

    [BsonElement("selectedAnswer")]
    public string SelectedAnswer { get; set; } = string.Empty;

    [BsonElement("isCorrect")]
    public bool IsCorrect { get; set; }
}

// ── Student Progress ──
public class StudentProgress
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("studentId")]
    public string StudentId { get; set; } = string.Empty;

    [BsonElement("levelCode")]
    public string LevelCode { get; set; } = string.Empty;

    [BsonElement("completedLessons")]
    public List<string> CompletedLessons { get; set; } = new(); // lesson IDs

    [BsonElement("exerciseScores")]
    public List<LessonExerciseScore> ExerciseScores { get; set; } = new();

    [BsonElement("testResults")]
    public List<string> TestResults { get; set; } = new(); // test result IDs

    [BsonElement("currentModuleId")]
    public string? CurrentModuleId { get; set; }

    [BsonElement("overallProgress")]
    public double OverallProgress { get; set; } // 0-100

    [BsonElement("startedAt")]
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("completedAt")]
    public DateTime? CompletedAt { get; set; }
}

public class LessonExerciseScore
{
    [BsonElement("lessonId")]
    public string LessonId { get; set; } = string.Empty;

    [BsonElement("score")]
    public int Score { get; set; } // correct out of total

    [BsonElement("total")]
    public int Total { get; set; }

    [BsonElement("attempts")]
    public int Attempts { get; set; }

    [BsonElement("completedAt")]
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}
