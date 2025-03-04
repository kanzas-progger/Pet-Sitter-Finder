namespace Boards.Infrastructure.Entities;

public class BoardEntity
{
    public Guid Id { get; set; }
    public Guid SitterId { get; set; }
    public string Content { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<BoardAnimalsEntity> BoardAnimals { get; set; } = new List<BoardAnimalsEntity>();
}