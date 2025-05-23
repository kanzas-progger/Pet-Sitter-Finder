using Animals.Core.Abstractions;
using Animals.Core.DTOs;
using Animals.Core.Models;
using Animals.Infrastructure.Providers;

namespace Animals.Application.Services;

public class AnimalProfilesService : IAnimalProfilesService
{
    private readonly IAnimalProfileRepository _animalProfileRepository;
    
    public AnimalProfilesService(IAnimalProfileRepository animalProfileRepository)
    {
        _animalProfileRepository = animalProfileRepository;
    }

    public async Task<AnimalProfile> Create(AnimalProfile animalProfile)
    {
        return await _animalProfileRepository.Create(animalProfile);
    }

    public async Task<List<AnimalProfile>> GetAllForOwner(Guid ownerId)
    {
        return await _animalProfileRepository.GetAllForOwner(ownerId);
    }

    public async Task<AnimalProfile> Update(AnimalProfile animalProfile)
    {
        return await _animalProfileRepository.Update(animalProfile);
    }

    public async Task Delete(Guid animalProfileId, Guid ownerId)
    {
        await _animalProfileRepository.Delete(animalProfileId, ownerId);
    }

    public async Task<int> GetAnimalIdByName(string animalName)
    {
        return await _animalProfileRepository.GetAnimalIdByName(animalName);
    }

    public async Task UpdateAnimalProfileImage(Guid animalProfileId, Guid ownerId, string image)
    {
        await _animalProfileRepository.UpdateAnimalProfileImage(animalProfileId, ownerId, image);
    }

    public async Task<string> GetAnimalProfileImage(Guid animalProfileId)
    {
        return await _animalProfileRepository.GetAnimalProfileImage(animalProfileId);
    }

    public async Task<List<ShortAnimalProfileDto>> GetAnimalProfileData(List<string> animalNames, Guid ownerId)
    {
        return await _animalProfileRepository.GetAnimalProfileData(animalNames, ownerId);
    }

    public async Task<AnimalProfile> GetById(Guid animalProfileId)
    {
        return await _animalProfileRepository.GetById(animalProfileId);
    }
}