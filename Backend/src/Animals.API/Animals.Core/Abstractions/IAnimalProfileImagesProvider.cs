using Microsoft.AspNetCore.Http;

namespace Animals.Infrastructure.Providers;

public interface IAnimalProfileImagesProvider
{
    Task<string> SaveImage(IFormFile image);
    string DeleteImage(string imagePath);
}