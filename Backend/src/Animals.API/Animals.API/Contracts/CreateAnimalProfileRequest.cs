namespace Animals.API.Contracts;

public record CreateAnimalProfileRequest(string animalName, string name, DateTime birthday,
    string gender, string type, int count, string description, string profileImage);