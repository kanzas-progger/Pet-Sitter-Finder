using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Notifications.API.Contracts;
using Notifications.Core.Abstractions;
using Notifications.Core.Models;

namespace Notifications.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationsService _notificationsService;

    public NotificationsController(INotificationsService notificationsService)
    {
        _notificationsService = notificationsService;
    }

    [HttpPost]
    public async Task<ActionResult> CreateNotification(CreateNotificationRequest request)
    {
        var (newNotification, error) = Notification.Create(
            Guid.NewGuid(),
            request.senderId,
            request.recipientId,
            request.type,
            request.description,
            false,
            DateTime.UtcNow);
        
        if (!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        await _notificationsService.CreateNotification(newNotification);
        
        return Ok();
    }

    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<List<GetNotificationResponse>>> GetNotifications(Guid userId)
    {
        var notifications = await _notificationsService.GetAllNotificationsForUser(userId);
        
        var response = notifications.Select(n => new GetNotificationResponse(
                n.Id,
                n.SenderId,
                n.RecipientId,
                n.Type,
                n.Description,
                n.CreatedAt
            ));
        
        return Ok(response);
    }

    [HttpGet("count/{userId:guid}")]
    public async Task<ActionResult<int>> GetUnreadNotificationsCount(Guid userId)
    {
        var response = await _notificationsService.GetUnreadNotificationsCount(userId);
        
        return Ok(response);
    }
}