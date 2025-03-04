using Boards.Infrastructure.Configurations;
using Boards.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Boards.Infrastructure;

public class BoardsDbContext : DbContext
{
    public BoardsDbContext(DbContextOptions<BoardsDbContext> options) : base(options) { }
    
    public DbSet<BoardEntity> Boards { get; set; }
    public DbSet<BoardAnimalsEntity> BoardAnimals { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new BoardConfiguration());
        modelBuilder.ApplyConfiguration(new BoardAnimalsConfiguration());
    }
}