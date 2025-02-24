using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Animals.Infrastructure.Providers;

public class AnimalProfileImagesProvider : IAnimalProfileImagesProvider
{
    private readonly IWebHostEnvironment _environment;

    public AnimalProfileImagesProvider(IWebHostEnvironment environment)
    {
        _environment = environment;
    }
    
    
    public async Task<string> SaveImage(IFormFile image)
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
        string infrastructurePath = Path.Combine(Directory.GetParent(contentRootPath).FullName, 
            "Animals.Infrastructure");
        string imgPath = Path.Combine(infrastructurePath, folderPath);
        
        if(!Directory.Exists(imgPath))
            Directory.CreateDirectory(imgPath);
        
        string filePath = Path.Combine(imgPath, fileName);
        
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(fileStream);
        }

        return filePath;
    }

    public string DeleteImage(string imagePath)
    {
        if (File.Exists(imagePath))
        {
            File.Delete(imagePath);
            return "Profile image deleted";
        }

        return String.Empty;
    }
}