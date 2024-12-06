using UserProfiles.Core.Models;

namespace UserProfiles.Core.Abstractions;

public interface IOwnerProfilesRepository
{
    Task<Guid> Create(OwnerProfile ownerProfile);
    Task<List<OwnerProfile>> GetAll();
    Task<OwnerProfile> GetById(Guid ownerId);
    Task<Guid> Update(OwnerProfile ownerProfile);
    Task UpdateImage(Guid ownerId, string imagePath);
    Task<int> GetProfilesPhotoCount(Guid ownerId);
    Task CreateProfilePhotos(Guid ownerId, List<string> photoPaths);
    Task<List<string>> GetAllProfilePhotos(Guid ownerId);
}