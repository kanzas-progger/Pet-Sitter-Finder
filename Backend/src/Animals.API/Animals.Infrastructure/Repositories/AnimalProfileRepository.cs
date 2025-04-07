using Animals.Core.Abstractions;
using Animals.Core.DTOs;
using Animals.Core.Models;
using Animals.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Animals.Infrastructure.Repositories;

public class AnimalProfileRepository : IAnimalProfileRepository
{
    private readonly AnimalsDbContext _animalsDbContext;

    public AnimalProfileRepository(AnimalsDbContext animalsDbContext)
    {
        _animalsDbContext = animalsDbContext;
    }

    public async Task<AnimalProfile> Create(AnimalProfile animalProfile)
    {
        var newAnimalProfile = new AnimalProfileEntity
        {
            Id = animalProfile.Id,
            AnimalId = animalProfile.AnimalId,
            OwnerId = animalProfile.OwnerId,
            Name = animalProfile.Name,
            Birthday = animalProfile.Birthday,
            Gender = animalProfile.Gender,
            Type = animalProfile.Type,
            Count = animalProfile.Count,
            Description = animalProfile.Description,
            ProfileImage = animalProfile.ProfileImage
        };
        
        await _animalsDbContext.AnimalProfiles.AddAsync(newAnimalProfile);
        await _animalsDbContext.SaveChangesAsync();
        
        return animalProfile;
    }

    public async Task<List<AnimalProfile>> GetAllForOwner(Guid ownerId)
    {
        var animalProfiles = await _animalsDbContext.AnimalProfiles
            .Where(a => a.OwnerId == ownerId)
            .Select(a => AnimalProfile.Create(
                a.Id,
                a.AnimalId,
                a.OwnerId,
                a.Name,
                a.Birthday,
                a.Gender,
                a.Type,
                a.Count,
                a.Description,
                a.ProfileImage).animalProfile)
            .ToListAsync();
        
        return animalProfiles;
    }

    public async Task<AnimalProfile> GetById(Guid animalProfileId)
    {
        var animalProfile = await _animalsDbContext.AnimalProfiles
            .Where(a => a.Id == animalProfileId)
            .Select(a => AnimalProfile.Create(
                a.Id,
                a.AnimalId,
                a.OwnerId,
                a.Name,
                a.Birthday,
                a.Gender,
                a.Type,
                a.Count,
                a.Description,
                a.ProfileImage).animalProfile)
            .FirstOrDefaultAsync();
        
        return animalProfile;
    }

    public async Task<AnimalProfile> Update(AnimalProfile animalProfile)
    {
        await _animalsDbContext.AnimalProfiles.Where(a => a.Id == animalProfile.Id 
                                                          && a.OwnerId == animalProfile.OwnerId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(a => a.AnimalId, animalProfile.AnimalId)
                .SetProperty(a => a.Name, animalProfile.Name)
                .SetProperty(a => a.Birthday, animalProfile.Birthday)
                .SetProperty(a => a.Gender, animalProfile.Gender)
                .SetProperty(a => a.Type, animalProfile.Type)
                .SetProperty(a => a.Count, animalProfile.Count)
                .SetProperty(a => a.Description, animalProfile.Description));
        
        return animalProfile;
    }

    public async Task Delete(Guid animalProfileId, Guid ownerId)
    {
        await _animalsDbContext.AnimalProfiles
            .Where(a => a.Id == animalProfileId && a.OwnerId == ownerId)
            .ExecuteDeleteAsync();
    }

    public async Task<string> GetAnimalProfileImage(Guid animalProfileId)
    {
        return await _animalsDbContext.AnimalProfiles.Where(a => a.Id == animalProfileId)
            .Select(a => a.ProfileImage).FirstOrDefaultAsync() ?? string.Empty;
    }

    public async Task UpdateAnimalProfileImage(Guid animalProfileId, Guid ownerId, 
        string animalProfileImage)
    {
        await _animalsDbContext.AnimalProfiles.Where(a => a.Id == animalProfileId && a.OwnerId == ownerId)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.ProfileImage, animalProfileImage));
    }

    public async Task<int> GetAnimalIdByName(string animalName)
    {
        var animalId = await _animalsDbContext.Animals
            .Where(a => a.Name.ToLower() == animalName.ToLower())
            .Select(a => a.Id)
            .FirstOrDefaultAsync();
        
        return animalId;
    }

    public async Task<List<ShortAnimalProfileDto>> GetAnimalProfileData(List<string> animalNames, Guid ownerId)
    {
        var animalIds = await _animalsDbContext.Animals
            .Where(a => animalNames.Contains(a.Name))
            .Select(a => new { a.Id, a.Name })
            .ToListAsync();

        var profiles = await _animalsDbContext.AnimalProfiles
            .Where(a => animalIds.Select(animal => animal.Id).Contains(a.AnimalId) && a.OwnerId == ownerId)
            .ToListAsync(); 

        var result = profiles.Select(a => new ShortAnimalProfileDto(
            a.Id,
            animalIds.FirstOrDefault(animal => animal.Id == a.AnimalId)?.Name ?? "Unknown",
            a.Name,
            a.Count
        )).ToList();

        return result;
    }
    
    public async Task<string> GetAnimalNameByAnimalId(int animalId)
    {
        return await _animalsDbContext.Animals
            .Where(a => a.Id == animalId)
            .Select(a => a.Name)
            .FirstOrDefaultAsync();
    }
}