using UserProfiles.Core.Models;

namespace UserProfiles.Core.Abstractions;

public interface ISitterProfilesRepository
{
    Task UpdateImage(Guid sitterId, string imagePath);
    Task<int> GetProfilesPhotoCount(Guid sitterId);
    Task CreateProfilePhotos(Guid sitterId, List<string> photoPaths);
    Task<List<string>> GetAllProfilePhotos(Guid sitterId);
    Task<SitterProfile> GetById(Guid sitterId);
    Task<Guid> Create(SitterProfile profile);
    Task<List<SitterProfile>> GetAll();
    Task<Guid> UpdateProfile(SitterProfile profile);
    Task<string> GetProfileImageUrl(Guid sitterId);
    Task DeleteProfilePhoto(Guid sitterId, string photoUrl);
}