using UserProfiles.Core.Models;

namespace UserProfiles.Core.Abstractions;

public interface IOwnerProfilesService
{
    Task<Guid> UpdateOwnerProfile(OwnerProfile ownerProfile);
    Task UpdateOwnerImage(Guid ownerId, string imagePath);
    Task<OwnerProfile> GetOwnerProfileById(Guid ownerId);
    Task<List<OwnerProfile>> GetAllOwnerProfiles();
    Task<int> GetOwnerProfilePhotoCount(Guid ownerId);
    Task AddOwnerProfilePhotos(Guid ownerId, List<string> photoPaths);
    Task<List<string>> GetAllOwnerProfilePhotos(Guid ownerId);
    Task<string> GetOwnerProfileImageUrl(Guid ownerId);
}