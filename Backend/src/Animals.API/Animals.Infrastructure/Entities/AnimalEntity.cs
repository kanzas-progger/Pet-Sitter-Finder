namespace Animals.Infrastructure.Entities;

public class AnimalEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<UserAnimalsEntity> UserAnimals { get; set; }

}