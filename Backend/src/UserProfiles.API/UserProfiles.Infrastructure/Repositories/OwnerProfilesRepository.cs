using Microsoft.EntityFrameworkCore;
using UserProfiles.Core.Models;
using UserProfiles.Infrastructure.Entities;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Infrastructure.Repositories;

public class OwnerProfilesRepository : IOwnerProfilesRepository
{
    private readonly UserProfilesDbContext _userProfilesDbContext;

    public OwnerProfilesRepository(UserProfilesDbContext userProfilesDbContext)
    {
        _userProfilesDbContext = userProfilesDbContext;
    }

    public async Task<Guid> Create(OwnerProfile ownerProfile)
    {
        var newOwnerProfile = new OwnerProfileEntity
        {
            Id = ownerProfile.Id,
            OwnerId = ownerProfile.OwnerId,
            Login = ownerProfile.Login,
            Firstname = ownerProfile.Firstname,
            Lastname = ownerProfile.Lastname,
            Age = ownerProfile.Age,
            Fathername = ownerProfile.Fathername,
            Email = ownerProfile.Email,
            PhoneNumber = ownerProfile.PhoneNumber,
            ProfileImagePath = ownerProfile.ProfileImagePath,
            Country = ownerProfile.Country,
            City = ownerProfile.City,
            Address = ownerProfile.Address,
            About = ownerProfile.About,
        };

        //await _userProfilesDbContext.AddAsync(newOwnerProfile);
        await _userProfilesDbContext.OwnerProfiles.AddAsync(newOwnerProfile);
        await _userProfilesDbContext.SaveChangesAsync();

        return newOwnerProfile.Id;
    }

    public async Task<List<OwnerProfile>> GetAll()
    {
        var ownerProfileEntities = await _userProfilesDbContext.OwnerProfiles.AsNoTracking().ToListAsync();

        var ownerProfiles = ownerProfileEntities.Select(o => OwnerProfile.Create(o.Id, o.OwnerId,
            o.Login, o.Firstname, o.Lastname, o.Fathername, o.Age, o.Email, o.PhoneNumber,
            o.ProfileImagePath, o.Country, o.City, o.Address, o.About).ownerProfile).ToList();

        return ownerProfiles;
    }

    public async Task<OwnerProfile> GetById(Guid ownerId)
    {
        var ownerProfileEntity = await _userProfilesDbContext.OwnerProfiles
            .AsNoTracking().FirstOrDefaultAsync(o => o.OwnerId == ownerId);

        if (ownerProfileEntity == null)
            throw new NullReferenceException($"Owner profile with id {ownerId} not found");

        var ownerProfile = OwnerProfile.Create(ownerProfileEntity.Id, ownerProfileEntity.OwnerId,
            ownerProfileEntity.Login, ownerProfileEntity.Firstname, ownerProfileEntity.Lastname,
            ownerProfileEntity.Fathername, ownerProfileEntity.Age, ownerProfileEntity.Email,
            ownerProfileEntity.PhoneNumber, ownerProfileEntity.ProfileImagePath,
            ownerProfileEntity.Country, ownerProfileEntity.City, ownerProfileEntity.Address,
            ownerProfileEntity.About).ownerProfile;

        return ownerProfile;
    }

    public async Task<Guid> Update(OwnerProfile ownerProfile)
    {
        await _userProfilesDbContext.OwnerProfiles.Where(o => o.OwnerId == ownerProfile.OwnerId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.Firstname, ownerProfile.Firstname)
                .SetProperty(o => o.Lastname, ownerProfile.Lastname)
                .SetProperty(o => o.Fathername, ownerProfile.Fathername)
                .SetProperty(o => o.Email, ownerProfile.Email)
                .SetProperty(o => o.PhoneNumber, ownerProfile.PhoneNumber)
                .SetProperty(o => o.Country, ownerProfile.Country)
                .SetProperty(o => o.City, ownerProfile.City)
                .SetProperty(o => o.Address, ownerProfile.Address)
                .SetProperty(o => o.About, ownerProfile.About));

        return ownerProfile.Id;
    }

    public async Task UpdateImage(Guid ownerId, string imagePath)
    {
        await _userProfilesDbContext.OwnerProfiles.Where(o => o.OwnerId == ownerId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(o => o.ProfileImagePath, imagePath));
    }


    public async Task<int> GetProfilesPhotoCount(Guid ownerId)
    {
        int count = await _userProfilesDbContext.OwnerProfilePhotos
            .Where(o => o.OwnerId == ownerId).CountAsync();

        return count;
    }

    public async Task CreateProfilePhotos(Guid ownerId, List<string> photoPaths)
    {
        Guid profileId = await _userProfilesDbContext.OwnerProfiles
            .Where(o => o.OwnerId == ownerId)
            .Select(o => o.Id)
            .FirstOrDefaultAsync();
        
        var newPhotos = photoPaths.Select(path => new OwnerProfilePhotosEntity
        {
            Id = Guid.NewGuid(),
            OwnerProfileId = profileId,
            OwnerId = ownerId,
            PhotoUrl = path
        });

        await _userProfilesDbContext.OwnerProfilePhotos.AddRangeAsync(newPhotos);
        await _userProfilesDbContext.SaveChangesAsync();
        
    }

    public async Task<List<string>> GetAllProfilePhotos(Guid ownerId)
    {
        var ownerPhotos = await _userProfilesDbContext.OwnerProfilePhotos
            .Where(p => p.OwnerId == ownerId).ToListAsync();

        var photoUrls = ownerPhotos.Select(p => p.PhotoUrl).ToList();

        return photoUrls;
    }
}