using Notifications.Core.Enums;

namespace Notifications.API.Contracts;

public record GetNotificationResponse(Guid notificationId, Guid senderId, Guid recipientId,
    NotificationType type, string? description, DateTime createdAt);