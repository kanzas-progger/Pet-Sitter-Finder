namespace Boards.API.Contracts;

public record CreateBoardRequest(List<string> animalNames, string content, decimal price);