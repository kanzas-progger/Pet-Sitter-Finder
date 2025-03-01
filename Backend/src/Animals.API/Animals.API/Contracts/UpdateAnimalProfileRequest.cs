namespace Animals.API.Contracts;

public record UpdateAnimalProfileRequest(Guid animalProfileId, string animalName, string name, 
    DateTime birthday, string gender, string? type, int count, string? description, 
    IFormFile? profileImage, bool isProfileImageExist, string existingProfileImage);