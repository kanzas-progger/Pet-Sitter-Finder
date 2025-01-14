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
}