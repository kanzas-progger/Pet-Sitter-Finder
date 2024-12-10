using Microsoft.AspNetCore.Http;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Application.Services;

public class ImagesService : IImagesService
{
    private readonly IImagesProvider _imagesProvider;

    public ImagesService(IImagesProvider imagesProvider)
    {
        _imagesProvider = imagesProvider;
    }

    public async Task<string> UploadImage(IFormFile image)
    {
        return await _imagesProvider.SaveProfileImage(image);
    }

    public async Task<List<string>> UploadProfilePhotos(List<IFormFile> photos)
    {
        return await _imagesProvider.SaveProfilePhotos(photos);
    }
    
    public string DeleteProfileImage(string imagePath)
    {
        return _imagesProvider.DeleteProfileImage(imagePath);
    }
}