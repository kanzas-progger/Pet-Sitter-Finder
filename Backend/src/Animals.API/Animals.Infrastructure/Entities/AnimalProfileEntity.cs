namespace Animals.Infrastructure.Entities;

public class AnimalProfileEntity
{
    public Guid Id { get; set; }
    public int AnimalId { get; set; }
    public Guid OwnerId { get; set; }
    public string Name { get; set; } = String.Empty;
    public DateTime Birthday { get; set; } = DateTime.UtcNow;
    public string Gender { get; set; } = String.Empty;
    public string Type { get; set; } = String.Empty;
    public int Count { get; set; } = 1;
    public string Description { get; set; } = String.Empty;
    public string ProfileImage { get; set; } = String.Empty;
}