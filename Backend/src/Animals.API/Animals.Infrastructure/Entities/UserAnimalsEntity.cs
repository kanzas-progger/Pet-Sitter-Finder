using System.ComponentModel.DataAnnotations.Schema;

namespace Animals.Infrastructure.Entities;

[Table("UserAnimals")]
public class UserAnimalsEntity
{
    public Guid UserId { get; set; }
    public int AnimalId { get; set; }
    public AnimalEntity Animal { get; set; }
}