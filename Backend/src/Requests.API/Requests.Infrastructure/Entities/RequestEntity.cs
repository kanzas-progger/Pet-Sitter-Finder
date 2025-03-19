namespace Requests.Infrastructure.Entities;

public class RequestEntity
{
    public Guid Id { get; set; }
    public Guid BoardId { get; set; }
    public Guid SitterId { get; set; }
    public Guid OwnerId { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; }
    public string? OwnerMessage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public ICollection<RequestAnimalsEntity> RequestAnimals { get; set; } = new List<RequestAnimalsEntity>();
}