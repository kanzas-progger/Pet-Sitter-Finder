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

    public async Task<List<SitterProfile>> GetAll()
    {
        var entities = await _userProfilesDbContext.SitterProfiles
            .AsNoTracking().ToListAsync();
        
        var profiles = entities.Select(p => SitterProfile.Create(p.Id,p.SitterId,p.Login,
            p.Firstname,p.Lastname,p.Fathername,p.Age,p.Email,p.PhoneNumber,p.ProfileImagePath,
            p.Country,p.City,p.Address,p.Rating,p.RateCount,p.About,p.PricePerDay).sitterProfile)
            .ToList();
        
        return profiles;
    }

    public async Task<SitterProfile> GetById(Guid sitterId)
    {
        var entity = await _userProfilesDbContext.SitterProfiles
            .AsNoTracking().FirstOrDefaultAsync(s => s.SitterId == sitterId);
        if (entity == null)
            throw new NullReferenceException($"Siter profile with id {sitterId} not found");

        var profile = SitterProfile.Create(entity.Id,
            entity.SitterId, entity.Login, entity.Firstname,
            entity.Lastname, entity.Fathername, entity.Age,
            entity.Email, entity.PhoneNumber, entity.ProfileImagePath,
            entity.Country, entity.City, entity.Address,
            entity.Rating, entity.RateCount, entity.About,
            entity.PricePerDay).sitterProfile;
        
        return profile;
    }
    
    
    public async Task UpdateImage(Guid sitterId, string imagePath)
    {
        await _userProfilesDbContext.SitterProfiles.Where(o => o.SitterId == sitterId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.ProfileImagePath, imagePath));
    }
    
    public async Task<string> GetProfileImageUrl(Guid sitterId)
    {
        string? profileImage = await _userProfilesDbContext.SitterProfiles
            .AsNoTracking()
            .Where(o => o.SitterId == sitterId)
            .Select(o => o.ProfileImagePath)
            .FirstOrDefaultAsync();
        
        return profileImage ?? string.Empty;
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
        var sitterPhotos = await _userProfilesDbContext.SitterProfilePhotos
            .Where(p => p.SitterId == sitterId).ToListAsync();
        
        var photoUrls = sitterPhotos.Select(p => p.PhotoUrl).ToList();
        return photoUrls;
    }

    public async Task DeleteProfilePhoto(Guid sitterId, string photoUrl)
    {
        await _userProfilesDbContext.SitterProfilePhotos
            .Where(p => p.SitterId == sitterId && p.PhotoUrl == photoUrl)
            .ExecuteDeleteAsync();
    }

    public async Task<Guid> UpdateProfile(SitterProfile profile)
    {
        await _userProfilesDbContext.SitterProfiles.Where(s => s.SitterId == profile.SitterId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(s => s.Firstname, profile.Firstname)
                .SetProperty(s => s.Lastname, profile.Lastname)
                .SetProperty(s => s.Fathername, profile.Fathername)
                .SetProperty(s => s.Email, profile.Email)
                .SetProperty(s => s.PhoneNumber, profile.PhoneNumber)
                .SetProperty(s => s.Country, profile.Country)
                .SetProperty(s => s.City, profile.City)
                .SetProperty(s => s.Address, profile.Address)
                .SetProperty(s => s.About, profile.About)
                .SetProperty(p => p.PricePerDay, profile.PricePerDay));
        
        return profile.Id;
    }
}