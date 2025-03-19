namespace Requests.API.Contracts;

public record RequestAnimalRequest(string name, int count, Guid? animalProfileId);