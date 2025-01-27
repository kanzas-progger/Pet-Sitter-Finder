using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
namespace UserProfiles.Core.Abstractions;

public interface IImagesProvider
{
    Task<string> SaveProfileImage(IFormFile image);
    Task<List<string>> SaveProfilePhotos(List<IFormFile> profilePhotos);
    string DeleteProfileImage(string imagePath);
    string DeleteProfilePhoto(string photoUrl);
}