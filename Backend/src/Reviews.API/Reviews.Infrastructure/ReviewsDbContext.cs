using Microsoft.EntityFrameworkCore;
using Reviews.Infrastructure.Configurations;
using Reviews.Infrastructure.Entities;

namespace Reviews.Infrastructure;

public class ReviewsDbContext : DbContext
{
    public ReviewsDbContext(DbContextOptions<ReviewsDbContext> options) : base(options) { }
    
    public DbSet<ReviewEntity> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
    }
}