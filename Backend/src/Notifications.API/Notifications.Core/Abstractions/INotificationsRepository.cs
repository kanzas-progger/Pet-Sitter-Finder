using Notifications.Core.Models;

namespace Notifications.Core.Abstractions;

public interface INotificationsRepository
{
    Task<int> GetUnreadNotificationsCount(Guid userId);
    Task<List<Notification>> GetAllNotificationsForUser(Guid userId);
    Task DeleteNotifications(List<Guid> notificationIds);
    Task UpdateNotificationStatus(List<Guid> notificationIds);
}