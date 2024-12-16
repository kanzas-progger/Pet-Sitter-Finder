namespace Animals.Core.Models;

public class AnimalProfile
{
    public Guid Id { get; }
    public int AnimalId { get; }
    public Guid OwnerId { get; }
    public string Name { get; } = String.Empty;
    public int Years { get; } = 0;
    public int? Months { get; } = 0;
    public string Gender { get; } = String.Empty;
    public string Breed { get; } = String.Empty;
    public string? ProfileImage { get; } = String.Empty;
}