using Microsoft.EntityFrameworkCore;
using Notifications.Core.Abstractions;
using Notifications.Core.Enums;
using Notifications.Core.Models;

namespace Notifications.Infrastructure.Repositories;

public class NotificationsRepository : INotificationsRepository
{
    private readonly NotificationsDbContext _context;

    public NotificationsRepository(NotificationsDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetUnreadNotificationsCount(Guid userId)
    {
        int count = await _context.Notifications.CountAsync(n => n.RecipientId == userId && n.IsRead == false);
        return count;
    }

    public async Task<List<Notification>> GetAllNotificationsForUser(Guid userId)
    {
        var notificationEntities = await _context.Notifications
            .Where(n => n.RecipientId == userId)
            .ToListAsync();

        var notifications = notificationEntities.Select(n => Notification.Create(
            n.Id,
            n.SenderId,
            n.RecipientId,
            (NotificationType)Enum.Parse(typeof(NotificationType), n.Type),
            n.Header,
            n.Body,
            n.IsRead,
            n.CreatedAt
        ).newNotification).ToList();
        
        return notifications;
    }

    public async Task DeleteNotifications(List<Guid> notificationIds)
    {
        foreach (var id in notificationIds)
        {
            await _context.Notifications.Where(n => n.Id == id).ExecuteDeleteAsync();
        }
    }

    public async Task UpdateNotificationStatus(List<Guid> notificationIds)
    {
        foreach (var id in notificationIds)
        {
            await _context.Notifications
                .Where(n => n.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        }
    }
}