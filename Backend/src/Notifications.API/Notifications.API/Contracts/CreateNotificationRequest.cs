using Notifications.Core.Enums;

namespace Notifications.API.Contracts;

public record CreateNotificationRequest(Guid senderId, Guid recipientId, NotificationType type,
    string? description);