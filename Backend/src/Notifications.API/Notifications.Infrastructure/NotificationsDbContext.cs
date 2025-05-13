using Microsoft.EntityFrameworkCore;
using Notifications.Infrastructure.Configurations;
using Notifications.Infrastructure.Entities;

namespace Notifications.Infrastructure;

public class NotificationsDbContext : DbContext
{
    public NotificationsDbContext(DbContextOptions<NotificationsDbContext> options) : base(options) { }
    
    public DbSet<NotificationEntity> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
    }
}