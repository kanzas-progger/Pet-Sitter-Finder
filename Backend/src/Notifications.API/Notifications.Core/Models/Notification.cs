using System.Security.Cryptography.X509Certificates;
using Notifications.Core.Enums;

namespace Notifications.Core.Models;

public class Notification
{
    public const int MAX_DESCRIPTION_LENGTH = 500;
    public Guid Id { get; }
    public Guid SenderId { get; }
    public Guid RecipientId { get; }
    public NotificationType Type { get; }
    public string? Description { get; }
    public bool IsRead { get; }
    public DateTime CreatedAt { get; }

    public Notification(Guid id, Guid senderId, Guid recipientId, NotificationType type, 
        string? description, bool isRead, DateTime createdAt)
    {
        Id = id;
        SenderId = senderId;
        RecipientId = recipientId;
        Type = type;
        Description = description;
        IsRead = isRead;
        CreatedAt = createdAt;
    }

    public static (Notification newNotification, string error) Create(Guid id, Guid senderId,
        Guid recipientId, NotificationType type, string? description, bool isRead, DateTime createdAt)
    {
        string error = String.Empty;
        if (description?.Length > MAX_DESCRIPTION_LENGTH)
            error += $"Max description length is {MAX_DESCRIPTION_LENGTH}";
        
        Notification newNotification = new Notification(id, senderId, recipientId, type, 
            description, isRead, createdAt);
        return (newNotification, error);
    }
}

