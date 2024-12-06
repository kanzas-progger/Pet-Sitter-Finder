using Microsoft.EntityFrameworkCore;
using UserProfiles.Infrastructure.Entities;
using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;

namespace UserProfiles.Infrastructure.Repositories;

public class SitterProfilesRepository : ISitterProfilesRepository
{
    private readonly UserProfilesDbContext _userProfilesDbContext;

    public SitterProfilesRepository(UserProfilesDbContext userProfilesDbContext)
    {
        _userProfilesDbContext = userProfilesDbContext;
    }

    public async Task<Guid> Create(SitterProfile profile)
    {
        var newProfileEntity = new SitterProfileEntity
        {
            Id = profile.Id,
            SitterId = profile.SitterId,
            Login = profile.Login,
            Firstname = profile.Firstname,
            Lastname = profile.Lastname,
            Fathername = profile.Fathername,
            Age = profile.Age,
            Email = profile.Email,
            PhoneNumber = profile.PhoneNumber,
            ProfileImagePath = profile.ProfileImagePath,
            Country = profile.Country,
            City = profile.City,
            Address = profile.Address,
            Rating = profile.Rating,
            RateCount = profile.RateCount,
            PricePerDay = profile.PricePerDay,
            About = profile.About,
        };
        
        await _userProfilesDbContext.SitterProfiles.AddAsync(newProfileEntity);
        await _userProfilesDbContext.SaveChangesAsync();

        return newProfileEntity.Id;
    }

    public async Task<SitterProfile> GetById(Guid sitterId)
    {
        var sitterProfileEntity = await _userProfilesDbContext.SitterProfiles
            .AsNoTracking().FirstOrDefaultAsync(s => s.SitterId == sitterId);
        if (sitterProfileEntity == null)
            throw new NullReferenceException($"Siter profile with id {sitterId} not found");

        var profile = SitterProfile.Create(sitterProfileEntity.Id,
            sitterProfileEntity.SitterId, sitterProfileEntity.Login, sitterProfileEntity.Firstname,
            sitterProfileEntity.Lastname, sitterProfileEntity.Fathername, sitterProfileEntity.Age,
            sitterProfileEntity.Email, sitterProfileEntity.PhoneNumber, sitterProfileEntity.ProfileImagePath,
            sitterProfileEntity.Country, sitterProfileEntity.City, sitterProfileEntity.Address,
            sitterProfileEntity.Rating, sitterProfileEntity.RateCount, sitterProfileEntity.About,
            sitterProfileEntity.PricePerDay).sitterProfile;
        
        return profile;
    }
    
    
    public async Task UpdateImage(Guid sitterProfileId, string imagePath)
    {
        await _userProfilesDbContext.SitterProfiles.Where(o => o.SitterId == sitterProfileId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.ProfileImagePath, imagePath));
    }

    public async Task<int> GetProfilesPhotoCount(Guid sitterId)
    {
        int count = await _userProfilesDbContext.SitterProfilePhotos
            .Where(s => s.SitterId == sitterId)
            .CountAsync();

        return count;
    }

    public async Task CreateProfilePhotos(Guid sitterId, List<string> photoPaths)
    {
        Guid profileId = await _userProfilesDbContext.SitterProfiles
            .Where(o => o.SitterId == sitterId)
            .Select(o => o.Id)
            .FirstOrDefaultAsync();
        
        var newPhotos = photoPaths.Select(path => new SitterProfilePhotosEntity
        {
            Id = Guid.NewGuid(),
            SitterProfileId = profileId,
            SitterId = sitterId,
            PhotoUrl = path
        });
        
        await _userProfilesDbContext.SitterProfilePhotos.AddRangeAsync(newPhotos);
        await _userProfilesDbContext.SaveChangesAsync();
    }
    
    public async Task<List<string>> GetAllProfilePhotos(Guid sitterId)
    {
        var ownerPhotos = await _userProfilesDbContext.OwnerProfilePhotos
            .Where(p => p.OwnerId == sitterId).ToListAsync();
        
        var photoUrls = ownerPhotos.Select(p => p.PhotoUrl).ToList();
        return photoUrls;
    }
}