using Animals.Core.Abstractions;
using Animals.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Animals.Infrastructure.Repositories;

public class UserAnimalsRepository : IUserAnimalsRepository
{
    private readonly AnimalsDbContext _animalsDbContext;

    public UserAnimalsRepository(AnimalsDbContext animalsDbContext)
    {
        _animalsDbContext = animalsDbContext;
    }

    public async Task<List<string>> GetUserAnimals(Guid userId)
    {
        var animals = await _animalsDbContext.UserAnimals.Where(u => u.UserId == userId)
            .Include(u => u.Animal).Select(u => u.Animal.Name).ToListAsync();

        return animals;
    }
    
    public async Task<Dictionary<int, string>> GetUserAnimalsDict(Guid userId)
    {
        var animalNames = await _animalsDbContext.UserAnimals.Where(u => u.UserId == userId)
            .Include(u => u.Animal)
            .ToDictionaryAsync(u => u.Animal.Id, u => u.Animal.Name);

        return animalNames;
    }
    
    public async Task<List<int>> GetUserAnimalsIds(Guid userId)
    {
        var animalIds = await _animalsDbContext.UserAnimals.Where(u => u.UserId == userId)
            .Include(u => u.Animal)
            .Select(u => u.Animal.Id).ToListAsync();

        return animalIds;
    }

    public async Task<Dictionary<string, int>> GetAllAnimals()
    {
        return await _animalsDbContext.Animals.ToDictionaryAsync(a => a.Name.ToLower(), a => a.Id);
    }

    public async Task<Dictionary<int, string>> GetAllAnimalsDict()
    {
        return await _animalsDbContext.Animals.ToDictionaryAsync(a => a.Id, a => a.Name);
    }
    
    
    
    public async Task AddAnimalsForUser(Guid userId, List<int> animalIds)
    {
        var userAnimalsEntities = animalIds.Select(animalId => new UserAnimalsEntity
        {
            AnimalId = animalId,
            UserId = userId,
        });
        
        await _animalsDbContext.UserAnimals.AddRangeAsync(userAnimalsEntities);
        await _animalsDbContext.SaveChangesAsync();
    }

    public async Task UpdateAnimalsForUser(Guid userId, List<int> animalIds)
    {
        var currentAnimalsIds = await _animalsDbContext.UserAnimals
            .Where(u => u.UserId == userId)
            .Select(u => u.AnimalId)
            .ToListAsync();
        
        var animalsToAdd = animalIds.Except(currentAnimalsIds).ToList(); 
        var animalsToRemove = currentAnimalsIds.Except(animalIds).ToList();

        if (animalsToRemove.Any())
        {
            await DeleteAnimalsForUser(userId, animalsToRemove);
        }

        if (animalsToAdd.Any())
        {
            await AddAnimalsForUser(userId, animalsToAdd);
        }
        
    }

    private async Task DeleteAnimalsForUser(Guid userId, List<int> animalIds)
    {
        await _animalsDbContext.UserAnimals
            .Where(u => u.UserId == userId && animalIds.Contains(u.AnimalId))
            .ExecuteDeleteAsync();
    }
}