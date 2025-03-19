using Requests.Core.Enums;

namespace Requests.Core.Models;

public class Request
{
    public const int MAX_MESSAGE_LENGTH = 500;
    
    public Guid Id { get; }
    public Guid BoardId { get; }
    public Guid SitterId { get; }
    public Guid OwnerId { get; }
    public List<RequestAnimal> RequestAnimals { get; }
    public decimal TotalPrice { get; }
    public Status Status { get; }
    public DateTime StartDate { get; }
    public DateTime EndDate { get; }
    public string? OwnerMessage { get; }
    public DateTime CreatedAt { get; }

    private Request(Guid id, Guid boardId, Guid sitterId, Guid ownerId, List<RequestAnimal> requestAnimals,
        decimal totalPrice, Status status, DateTime startDate, DateTime endDate, string? ownerMessage, 
        DateTime createdAt)
    {
        Id = id;
        BoardId = boardId;
        SitterId = sitterId;
        OwnerId = ownerId;
        RequestAnimals = requestAnimals;
        TotalPrice = totalPrice;
        Status = status;
        OwnerMessage = ownerMessage;
        StartDate = startDate;
        EndDate = endDate;
        CreatedAt = createdAt;
    }

    public static (Request newRequest, string error) Create(Guid id, Guid boardId, Guid sitterId, 
        Guid ownerId, List<RequestAnimal> requestAnimals, decimal totalPrice, Status status, 
        DateTime startDate, DateTime endDate,string? ownerMessage, DateTime createdAt)
    {
        string error = string.Empty;
        
        if ((endDate - startDate).TotalDays < 1)
            error += "The holding time for animals must be at least 1 day";
        if (ownerMessage?.Length > MAX_MESSAGE_LENGTH)
            error += $"Max message length is {MAX_MESSAGE_LENGTH}";

        Request newRequest = new Request(id, boardId, sitterId, ownerId, requestAnimals, totalPrice, status,
            startDate, endDate, ownerMessage, createdAt);
        
        return (newRequest, error);
    }
}