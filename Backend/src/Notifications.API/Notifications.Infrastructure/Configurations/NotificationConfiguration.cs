using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Notifications.Core.Models;
using Notifications.Infrastructure.Entities;

namespace Notifications.Infrastructure.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<NotificationEntity>
{
    public void Configure(EntityTypeBuilder<NotificationEntity> builder)
    {
        builder.HasKey(n => n.Id);
        builder.Property(n => n.SenderId).IsRequired();
        builder.Property(n => n.RecipientId).IsRequired();
        builder.Property(n => n.Type).IsRequired();
        builder.Property(n => n.Description).IsRequired(false).HasMaxLength(Notification.MAX_DESCRIPTION_LENGTH);
        builder.Property(n => n.IsRead).IsRequired();
        builder.Property(n => n.CreatedAt).IsRequired();
    }
}