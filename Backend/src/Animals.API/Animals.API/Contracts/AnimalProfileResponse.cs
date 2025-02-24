namespace Animals.API.Contracts;

public record AnimalProfileResponse(Guid animalProfileId, int animalId, Guid ownerId, 
    string animalName, string name, DateTime birthday, string gender, string type, int count,
    string description, string profileImage);