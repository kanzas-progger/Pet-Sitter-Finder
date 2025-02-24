using Animals.Core.Abstractions;

namespace Animals.Application.Services;

public class AnimalsService : IAnimalsService
{
    private readonly IUserAnimalsRepository _userAnimalsRepository;

    public AnimalsService(IUserAnimalsRepository userAnimalsRepository)
    {
        _userAnimalsRepository = userAnimalsRepository;
    }

    public async Task UpdateUserAnimals(Guid userId, List<int> animalIds)
    {
        await _userAnimalsRepository.UpdateAnimalsForUser(userId, animalIds);
    }

    public async Task<Dictionary<string, int>> GetAllAnimals()
    {
        return await _userAnimalsRepository.GetAllAnimals();
    }

    public async Task<List<string>> GetUserAnimals(Guid userId)
    {
        return await _userAnimalsRepository.GetUserAnimals(userId);
    }

    public async Task<Dictionary<int, string>> GetUserAnimalsDict(Guid userId)
    {
        return await _userAnimalsRepository.GetUserAnimalsDict(userId);
    }

    public async Task<Dictionary<int, string>> GetAllAnimalsDict()
    {
        return await _userAnimalsRepository.GetAllAnimalsDict();
    }

    public async Task<List<int>> GetUserAnimalsIds(Guid userId)
    {
        return await _userAnimalsRepository.GetUserAnimalsIds(userId);
    }
}