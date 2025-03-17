namespace Boards.API.Contracts;

public record BoardSitterAgregateResponse(Guid sitterId, string login, string firstname,
    string lastname, string profileImage, string city, string address, decimal rating, 
    int rateCount, string content, List<string> animalNames, decimal price);