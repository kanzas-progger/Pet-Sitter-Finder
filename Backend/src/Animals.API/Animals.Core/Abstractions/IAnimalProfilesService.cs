using Animals.Core.Models;

namespace Animals.Core.Abstractions;

public interface IAnimalProfilesService
{
    Task<AnimalProfile> Create(AnimalProfile animalProfile);
    Task<List<AnimalProfile>> GetAllForOwner(Guid ownerId);
    Task<AnimalProfile> Update(AnimalProfile animalProfile);
    Task Delete(Guid animalProfileId, Guid ownerId);
    Task<int> GetAnimalIdByName(string animalName);
    Task<string> GetAnimalProfileImage(Guid animalProfileId);
    Task UpdateAnimalProfileImage(Guid animalProfileId, Guid ownerId, string image);
}