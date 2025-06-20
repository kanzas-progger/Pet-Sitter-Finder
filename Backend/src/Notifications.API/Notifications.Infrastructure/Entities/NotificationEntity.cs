using Notifications.Core.Enums;

namespace Notifications.Infrastructure.Entities;

public class NotificationEntity
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public string Type { get; set; }
    public string? Description { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}