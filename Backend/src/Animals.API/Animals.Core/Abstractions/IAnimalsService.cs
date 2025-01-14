namespace Animals.Core.Abstractions;

public interface IAnimalsService
{
    Task UpdateUserAnimals(Guid userId, List<int> animalIds);
    Task<Dictionary<string, int>> GetAllAnimals();
}