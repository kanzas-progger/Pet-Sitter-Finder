namespace Animals.Core.Abstractions;

public interface IAnimalsService
{
    Task UpdateUserAnimals(Guid userId, List<int> animalIds);
    Task<Dictionary<string, int>> GetAllAnimals();
    Task<Dictionary<int, string>> GetUserAnimalsDict(Guid userId);
    Task<List<string>> GetUserAnimals(Guid userId);
    Task<Dictionary<int, string>> GetAllAnimalsDict();
    Task<List<int>> GetUserAnimalsIds(Guid userId);
}