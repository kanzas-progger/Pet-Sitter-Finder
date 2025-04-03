namespace Animals.API.Contracts;

public record ShortAnimalProfileResponse(Guid animalProfileId, string animalName, string name, int count);