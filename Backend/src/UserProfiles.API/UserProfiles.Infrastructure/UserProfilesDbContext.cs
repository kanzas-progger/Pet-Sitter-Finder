using Microsoft.EntityFrameworkCore;
using UserProfiles.Core.Models;
using UserProfiles.Infrastructure.Configurations;
using UserProfiles.Infrastructure.Entities;

namespace UserProfiles.Infrastructure;

public class UserProfilesDbContext : DbContext
{
    public UserProfilesDbContext(DbContextOptions<UserProfilesDbContext> options) : base(options) { }
    
    public DbSet<OwnerProfileEntity> OwnerProfiles { get; set; }
    public DbSet<SitterProfileEntity> SitterProfiles { get; set; }
    
    public DbSet<OwnerProfilePhotosEntity> OwnerProfilePhotos { get; set; }
    public DbSet<SitterProfilePhotosEntity> SitterProfilePhotos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new OwnerProfileConfiguration());
        modelBuilder.ApplyConfiguration(new SitterProfileConfiguration());
        modelBuilder.ApplyConfiguration(new OwnerProfilePhotosConfiguration());
        modelBuilder.ApplyConfiguration(new SitterProfilePhotosConfiguration());
    }
}