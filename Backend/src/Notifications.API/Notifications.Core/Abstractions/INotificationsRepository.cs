using Notifications.Core.Models;

namespace Notifications.Core.Abstractions;

public interface INotificationsRepository
{
    Task<int> GetUnreadNotificationsCount(Guid userId);
    Task<List<Notification>> GetAllNotificationsForUser(Guid userId);
    Task DeleteNotification();
    Task UpdateNotificationReadStatus(List<Guid> notificationIds);
    Task<Notification> CreateNotification(Notification notification);
}