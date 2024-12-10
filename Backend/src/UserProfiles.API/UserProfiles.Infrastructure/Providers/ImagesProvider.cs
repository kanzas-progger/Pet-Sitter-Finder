using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Infrastructure.Providers;

public class ImagesProvider : IImagesProvider
{
    private readonly IWebHostEnvironment _environment;

    public ImagesProvider(IWebHostEnvironment environment)
    {
        _environment = environment;
    }
    
    public async Task<string> SaveProfileImage(IFormFile image)
    {
        string[] allowedExtensions = {".jpg", ".jpeg", ".png"};
        
        string imageExtension = Path.GetExtension(image.FileName);

        if (!allowedExtensions.Contains(imageExtension))
        {
            throw new InvalidDataException("Invalid image format");
        }
        
        string fileName = $"{Guid.NewGuid()}{imageExtension}";

        string folderPath = Path.Combine("uploads", "img");
        string contentRootPath = _environment.ContentRootPath;
        string backendPath = Directory.GetParent(Directory.GetParent(
            Directory.GetParent(contentRootPath!).FullName).FullName).FullName;
        
        string imgPath = Path.Combine(backendPath, folderPath);
        
        if(!Directory.Exists(imgPath))
            Directory.CreateDirectory(imgPath);
        
        string filePath = Path.Combine(imgPath, fileName);
        Console.WriteLine(filePath);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(fileStream);
        }

        return filePath;
    }

    public string DeleteProfileImage(string imagePath)
    {
        if (File.Exists(imagePath))
        {
            File.Delete(imagePath);
            return "Profile image deleted";
        }

        return String.Empty;
    }
    
    public async Task<List<string>> SaveProfilePhotos(List<IFormFile> profilePhotos)
    {
        List<string> photoPaths = new List<string>();
        
        string[] allowedExtensions = {".jpg", ".jpeg", ".png"};
        
        string folderPath = Path.Combine("uploads", "img");
        string contentRootPath = _environment.ContentRootPath;
        string backendPath = Directory.GetParent(Directory.GetParent(
            Directory.GetParent(contentRootPath!).FullName).FullName).FullName;
        
        string imgPath = Path.Combine(backendPath, folderPath);
        
        if(!Directory.Exists(imgPath))
            Directory.CreateDirectory(imgPath);
        
        foreach (var photo in profilePhotos)
        {
            string photoExtension = Path.GetExtension(photo.FileName);
            if (!allowedExtensions.Contains(photoExtension))
                throw new InvalidDataException("Invalid photo format");
            
            string fileName = $"{Guid.NewGuid()}{photoExtension}";
            string filePath = Path.Combine(imgPath, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await photo.CopyToAsync(fileStream);
            }
            
            photoPaths.Add(filePath);
        }

        return photoPaths;
    }
}