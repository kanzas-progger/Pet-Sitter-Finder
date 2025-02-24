namespace Animals.Core.Abstractions;

public interface IUserAnimalsRepository
{
    Task<List<string>> GetUserAnimals(Guid userId);
    Task AddAnimalsForUser(Guid userId, List<int> animalIds);
    Task UpdateAnimalsForUser(Guid userId, List<int> animalIds);
    Task<Dictionary<string, int>> GetAllAnimals();
    Task<Dictionary<int, string>> GetUserAnimalsDict(Guid userId);
    Task<Dictionary<int, string>> GetAllAnimalsDict();
    Task<List<int>> GetUserAnimalsIds(Guid userId);
}