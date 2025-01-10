namespace UserProfiles.API.Contracts.Requests;

public record UpdateProfilePhotosRequest(List<IFormFile> profilePhotos);