using Animals.Core.DTOs;
using Animals.Core.Models;

namespace Animals.Core.Abstractions;

public interface IAnimalProfileRepository
{
    Task<AnimalProfile> Create(AnimalProfile animalProfile);
    Task<List<AnimalProfile>> GetAllForOwner(Guid ownerId);
    Task<AnimalProfile> Update(AnimalProfile animalProfile);
    Task Delete(Guid animalProfileId, Guid ownerId);
    Task<int> GetAnimalIdByName(string animalName);
    Task<string> GetAnimalNameByAnimalId(int animalId);
    Task<string> GetAnimalProfileImage(Guid animalProfileId);

    Task UpdateAnimalProfileImage(Guid animalProfileId, Guid ownerId,
        string animalProfileImage);

    Task<List<ShortAnimalProfileDto>> GetAnimalProfileData(List<string> animalNames, Guid ownerId);
    Task<AnimalProfile> GetById(Guid animalProfileId);
}