using Animals.Infrastructure.Configurations;
using Animals.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Animals.Infrastructure;

public class AnimalsDbContext : DbContext
{
    public AnimalsDbContext(DbContextOptions<AnimalsDbContext> options) : base(options) { }
    
    public DbSet<AnimalEntity> Animals { get; set; }
    public DbSet<UserAnimalsEntity> UserAnimals { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new AnimalConfiguration());
        modelBuilder.ApplyConfiguration(new UserAnimalsConfiguration());
    }
}