using UserProfiles.Core.Models;

namespace UserProfiles.Core.Abstractions;

public interface ISitterProfilesRepository
{
    Task UpdateImage(Guid sitterProfileId, string imagePath);
    Task<int> GetProfilesPhotoCount(Guid sitterId);
    Task CreateProfilePhotos(Guid sitterId, List<string> photoPaths);
    Task<List<string>> GetAllProfilePhotos(Guid sitterId);
    Task<Guid> Create(SitterProfile profile);
}