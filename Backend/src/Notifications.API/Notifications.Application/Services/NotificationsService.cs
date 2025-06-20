using Microsoft.AspNetCore.SignalR;
using Notifications.Application.Hubs;
using Notifications.Core.Abstractions;
using Notifications.Core.Models;

namespace Notifications.Application.Services;

public class NotificationsService : INotificationsService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly INotificationsRepository _notificationsRepository;

    public NotificationsService(IHubContext<NotificationHub> hubContext, 
        INotificationsRepository notificationsRepository)
    {
        _hubContext = hubContext;
        _notificationsRepository = notificationsRepository;
    }

    public async Task CreateNotification(Notification notification)
    {
        var newNotification = await _notificationsRepository.CreateNotification(notification);
        
        await _hubContext.Clients
            .Group(notification.RecipientId.ToString())
            .SendAsync("ReceiveNotification", newNotification);
    }

    public async Task<List<Notification>> GetAllNotificationsForUser(Guid userId)
    {
        return await _notificationsRepository.GetAllNotificationsForUser(userId);
    }

    public async Task MarkNotificationAsRead(List<Guid> notificationIds, Guid userId)
    {
        await _notificationsRepository.UpdateNotificationReadStatus(notificationIds);
        int unreadCount = await _notificationsRepository.GetUnreadNotificationsCount(userId);
        
        await _hubContext.Clients
            .Group(userId.ToString())
            .SendAsync("UpdateUnreadNotificationsCount", unreadCount);
    }

    public async Task<int> GetUnreadNotificationsCount(Guid userId)
    {
        return await _notificationsRepository.GetUnreadNotificationsCount(userId);
    }
}