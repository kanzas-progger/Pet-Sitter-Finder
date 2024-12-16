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
}