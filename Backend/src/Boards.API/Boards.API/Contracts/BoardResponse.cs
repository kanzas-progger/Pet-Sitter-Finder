namespace Boards.API.Contracts;

public record BoardResponse(Guid id, Guid sitterId, List<string> animalNames, string content, 
    decimal price, DateTime createdAt);