namespace Requests.API.Contracts;

public record RequestAnimalsResponse(string name, int count, Guid? animalProfileId);
