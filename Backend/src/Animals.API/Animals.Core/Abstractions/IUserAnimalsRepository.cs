namespace Animals.Core.Abstractions;

public interface IUserAnimalsRepository
{
    Task<List<string>> GetUserAnimals(Guid userId);
    Task AddAnimalsForUser(Guid userId, List<int> animalIds);
    Task UpdateAnimalsForUser(Guid userId, List<int> animalIds);
    Task<Dictionary<string, int>> GetAllAnimals();
}