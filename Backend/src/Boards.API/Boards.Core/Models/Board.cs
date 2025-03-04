namespace Boards.Core.Models;

public class Board
{
    public const int MAX_CONTENT_LENGTH = 300;
    public const int MIN_CONTENT_LENGTH = 50;
    public const int MIN_ANIMAL_IDS = 1;

    public Guid Id { get; }
    public Guid SitterId { get; }
    public List<int> AnimalIds { get; }
    public string Content { get; }
    public decimal Price { get; }
    public DateTime CreatedAt { get; }

    private Board(Guid id, Guid sitterId, List<int> animalIds, string content, decimal price, DateTime createdAt)
    {
        Id = id;
        SitterId = sitterId;
        AnimalIds = animalIds;
        Content = content;
        Price = price;
        CreatedAt = createdAt;
    }

    public static (Board newBoard, string error) Create(Guid id, Guid sitterId, List<int> animalIds,
        string content, decimal price, DateTime createdAt)
    {
        string error = string.Empty;
        if (content.Length > MAX_CONTENT_LENGTH)
            error += $"Content must be less than {MAX_CONTENT_LENGTH} characters";
        if (content.Length < MIN_CONTENT_LENGTH)
            error += $"Content must be at least {MIN_CONTENT_LENGTH} characters";
        if (animalIds.Count < MIN_ANIMAL_IDS)
            error += $"Minimum number of animals: {MIN_ANIMAL_IDS}";
        
        var newBoard = new Board(id, sitterId, animalIds, content, price, createdAt);
        
        return (newBoard, error);
    }
}