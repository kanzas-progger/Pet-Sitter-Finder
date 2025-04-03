using System.ComponentModel.DataAnnotations.Schema;

namespace Requests.Infrastructure.Entities;

[Table("RequestAnimals")]
public class RequestAnimalsEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RequestId { get; set; }
    public int AnimalId { get; set; }
    public int Count { get; set; }
    public Guid? AnimalProfileId { get; set; }
    
    public RequestEntity Request { get; set; }
}