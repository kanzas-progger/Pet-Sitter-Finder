namespace Requests.Core.Models;

public class RequestAnimal
{
    public int AnimalId { get; set; }
    public int Count { get; set; }
    public Guid? AnimalProfileId { get; set; }
}