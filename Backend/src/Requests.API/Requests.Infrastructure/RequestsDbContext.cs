using Microsoft.EntityFrameworkCore;
using Requests.Infrastructure.Configurations;
using Requests.Infrastructure.Entities;

namespace Requests.Infrastructure;

public class RequestsDbContext : DbContext
{
    public RequestsDbContext(DbContextOptions<RequestsDbContext> options) : base(options) { }
    
    public DbSet<RequestEntity> Requests { get; set; }
    public DbSet<RequestAnimalsEntity> RequestAnimals { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new RequestEntityConfiguration());
        modelBuilder.ApplyConfiguration(new RequestAnimalsConfiguration());
    }
}