using UserProfiles.Core.Models;

namespace UserProfiles.Core.Abstractions;

public interface ISitterProfileService
{
    Task<List<SitterProfile>> GetAllProfiles();
    Task<SitterProfile> GetProfileById(Guid sitterId);
    Task<int> GetProfilePhotoCount(Guid sitterId);
    Task<List<string>> GetAllProfilePhotos(Guid sitterId);
    Task<Guid> UpdateSitterProfile(SitterProfile profile);
    Task UpdateSitterProfileImage(Guid sitterId, string imagePath);
    Task<string> GetSitterImageUrl(Guid sitterId);
    Task AddSitterProfilePhotos(Guid sitterId, List<string> photoPaths);

}