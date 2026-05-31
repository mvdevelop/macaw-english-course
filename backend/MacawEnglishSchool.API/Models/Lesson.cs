using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MacawEnglishSchool.API.Models;

// ── Exercise ──
public class Exercise
{
    [BsonElement("order")]
    public int Order { get; set; }

    [BsonElement("type")]
    public string Type { get; set; } = "multiple-choice"; // multiple-choice, fill-blank, matching, listening, reading, writing

    [BsonElement("question")]
    public string Question { get; set; } = string.Empty;

    [BsonElement("options")]
    public List<string> Options { get; set; } = new(); // for multiple-choice / fill-blank

    [BsonElement("pairs")]
    public List<MatchPair> Pairs { get; set; } = new(); // for matching type

    [BsonElement("correctAnswer")]
    public string CorrectAnswer { get; set; } = string.Empty; // index as string for MC, text for others

    [BsonElement("explanation")]
    public string Explanation { get; set; } = string.Empty;

    [BsonElement("audioUrl")]
    public string? AudioUrl { get; set; } // for listening exercises

    [BsonElement("difficulty")]
    public string Difficulty { get; set; } = "easy"; // easy, medium, hard
}

public class MatchPair
{
    [BsonElement("left")]
    public string Left { get; set; } = string.Empty;

    [BsonElement("right")]
    public string Right { get; set; } = string.Empty;
}

// ── Content Block ──
public class ContentBlock
{
    [BsonElement("order")]
    public int Order { get; set; }

    [BsonElement("type")]
    public string Type { get; set; } = "text"; // text, image, reading, audio, video

    [BsonElement("body")]
    public string Body { get; set; } = string.Empty;

    [BsonElement("title")]
    public string? Title { get; set; } // for reading blocks

    [BsonElement("imageUrl")]
    public string? ImageUrl { get; set; } // for image blocks

    [BsonElement("caption")]
    public string? Caption { get; set; } // for image blocks

    [BsonElement("audioUrl")]
    public string? AudioUrl { get; set; } // for audio blocks

    [BsonElement("transcript")]
    public string? Transcript { get; set; } // for audio blocks

    [BsonElement("videoUrl")]
    public string? VideoUrl { get; set; } // for video blocks

    [BsonElement("questions")]
    public List<ReadingQuestion> Questions { get; set; } = new(); // for reading blocks
}

public class ReadingQuestion
{
    [BsonElement("question")]
    public string Question { get; set; } = string.Empty;

    [BsonElement("options")]
    public List<string> Options { get; set; } = new();

    [BsonElement("correctAnswer")]
    public string CorrectAnswer { get; set; } = string.Empty;
}

// ── Lesson ──
public class Lesson
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("levelCode")]
    public string LevelCode { get; set; } = string.Empty; // A1, A2, B1, B2, C1, C2

    [BsonElement("moduleId")]
    public string ModuleId { get; set; } = string.Empty;

    [BsonElement("moduleTitle")]
    public string ModuleTitle { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("order")]
    public int Order { get; set; } // 1-6 within module

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("content")]
    public List<ContentBlock> Content { get; set; } = new();

    [BsonElement("exercises")]
    public List<Exercise> Exercises { get; set; } = new();

    [BsonElement("estimatedMinutes")]
    public int EstimatedMinutes { get; set; } = 30;

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
