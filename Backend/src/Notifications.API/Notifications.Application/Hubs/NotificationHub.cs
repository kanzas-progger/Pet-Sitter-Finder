using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Notifications.Application.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private Guid GetUserIdFromClaim()
    {
        var userIdFromToken = Context.User.FindFirst("id-")?.Value;
        Guid userId;
        if(userIdFromToken == null)
            throw new UnauthorizedAccessException();

        Guid.TryParse(userIdFromToken, out userId);

        return userId;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserIdFromClaim();
        await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
        await base.OnConnectedAsync();
    }
}