using Microsoft.AspNetCore.Http;

namespace UserProfiles.Core.Abstractions;

public interface IImagesService
{
    Task<string> UploadImage(IFormFile image);
    Task<List<string>> UploadProfilePhotos(List<IFormFile> photos);
}