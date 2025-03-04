namespace Boards.API.Contracts;

public record UpdateBoardRequest(Guid boardId, List<string> animalNames, string content, 
    decimal price, DateTime createdAt);