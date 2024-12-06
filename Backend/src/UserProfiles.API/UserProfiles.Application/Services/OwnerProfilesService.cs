using System.ComponentModel.DataAnnotations;
using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;
using UserProfiles.Infrastructure.Entities;

namespace UserProfiles.Application.Services;

public class OwnerProfilesService : IOwnerProfilesService
{
    private readonly IOwnerProfilesRepository _ownerProfilesRepository;

    public OwnerProfilesService (IOwnerProfilesRepository ownerProfilesRepository)
    {
        _ownerProfilesRepository = ownerProfilesRepository;
    }

    public async Task<Guid> UpdateOwnerProfile(OwnerProfile ownerProfile)
    {
        var ownerProfileId = await _ownerProfilesRepository.Update(ownerProfile);
        return ownerProfileId;
    }

    public async Task UpdateOwnerImage(Guid ownerId, string imagePath)
    {
        await _ownerProfilesRepository.UpdateImage(ownerId, imagePath);
    }

    public async Task<OwnerProfile> GetOwnerProfileById(Guid ownerId)
    {
        return await _ownerProfilesRepository.GetById(ownerId);
    }

    public async Task<List<OwnerProfile>> GetAllOwnerProfiles()
    {
        return await _ownerProfilesRepository.GetAll();
    }

    public async Task<int> GetOwnerProfilePhotoCount(Guid ownerId)
    {
        return await _ownerProfilesRepository.GetProfilesPhotoCount(ownerId);
    }

    public async Task AddOwnerProfilePhotos(Guid ownerId, List<string> photoPaths)
    {
        await _ownerProfilesRepository.CreateProfilePhotos(ownerId, photoPaths);
    }

    public async Task<List<string>> GetAllOwnerProfilePhotos(Guid ownerId)
    {
        return await _ownerProfilesRepository.GetAllProfilePhotos(ownerId);
    }
}