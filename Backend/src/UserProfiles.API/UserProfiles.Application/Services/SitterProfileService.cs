using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;

namespace UserProfiles.Application.Services;

public class SitterProfileService : ISitterProfileService
{
    private readonly ISitterProfilesRepository _sitterProfilesRepository;

    public SitterProfileService(ISitterProfilesRepository sitterProfilesRepository)
    {
        _sitterProfilesRepository = sitterProfilesRepository;
    }

    public async Task<List<SitterProfile>> GetAllProfiles()
    {
        return await _sitterProfilesRepository.GetAll();
    }

    public async Task<SitterProfile> GetProfileById(Guid sitterId)
    {
        return await _sitterProfilesRepository.GetById(sitterId);
    }
    
    public async Task<int> GetProfilePhotoCount(Guid sitterId)
    {
        return await _sitterProfilesRepository.GetProfilesPhotoCount(sitterId);
    }
    
    public async Task<List<string>> GetAllProfilePhotos(Guid sitterId)
    {
        return await _sitterProfilesRepository.GetAllProfilePhotos(sitterId);
    }

    public async Task<Guid> UpdateSitterProfile(SitterProfile profile)
    {
        return await _sitterProfilesRepository.UpdateProfile(profile);
    }

    public async Task UpdateSitterProfileImage(Guid sitterId, string imagePath)
    {
        await _sitterProfilesRepository.UpdateImage(sitterId, imagePath);
    }

    public async Task<string> GetSitterImageUrl(Guid sitterId)
    {
        return await _sitterProfilesRepository.GetProfileImageUrl(sitterId);
    }

    public async Task AddSitterProfilePhotos(Guid sitterId, List<string> photoPaths)
    {
        await _sitterProfilesRepository.CreateProfilePhotos(sitterId, photoPaths);
    }

    public async Task DeleteSitterProfilePhoto(Guid sitterId, string photoPath)
    {
        await _sitterProfilesRepository.DeleteProfilePhoto(sitterId, photoPath);
    }
}