namespace Animals.API.Contracts;

public record UploadAnimalProfileImageRequest(Guid animalProfileId, IFormFile image);