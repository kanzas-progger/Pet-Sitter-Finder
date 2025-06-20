using Notifications.Core.Models;

namespace Notifications.Core.Abstractions;

public interface INotificationsService
{
    Task CreateNotification(Notification notification);
    Task<List<Notification>> GetAllNotificationsForUser(Guid userId);
    Task MarkNotificationAsRead(List<Guid> notificationIds, Guid userId);
    Task<int> GetUnreadNotificationsCount(Guid userId);
}