using Microsoft.EntityFrameworkCore;
using Notifications.Core.Abstractions;
using Notifications.Core.Enums;
using Notifications.Core.Models;
using Notifications.Infrastructure.Entities;

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
            n.Description,
            n.IsRead,
            n.CreatedAt
        ).newNotification).ToList();
        
        return notifications;
    }
    
    public async Task DeleteNotification()
    {
        int deleteDaysPeriod = 180;
        var deleteDate = DateTime.UtcNow.AddDays(-deleteDaysPeriod);
        
        await _context.Notifications
            .Where(n => n.CreatedAt < deleteDate)
            .ExecuteDeleteAsync();
    }

    public async Task UpdateNotificationReadStatus(List<Guid> notificationIds)
    {
        foreach (var id in notificationIds)
        {
            await _context.Notifications
                .Where(n => n.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        }
    }

    public async Task<Notification> CreateNotification(Notification notification)
    {
        var newNotificationEntity = new NotificationEntity
        {
            Id = notification.Id,
            SenderId = notification.SenderId,
            RecipientId = notification.RecipientId,
            Type = notification.Type.ToString(),
            Description = notification.Description,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
        
        await _context.Notifications.AddAsync(newNotificationEntity);
        await _context.SaveChangesAsync();
        
        return notification;
    }
}