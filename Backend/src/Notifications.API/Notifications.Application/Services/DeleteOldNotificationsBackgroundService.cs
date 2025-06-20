using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Notifications.Core.Abstractions;

namespace Notifications.Application.Services;

public class DeleteOldNotificationsBackgroundService : BackgroundService
{
    private const int DELETE_DAYS_INTERVAL = 60;
    private readonly IServiceProvider _serviceProvider;

    public DeleteOldNotificationsBackgroundService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var notificationsRepository = scope.ServiceProvider
                        .GetRequiredService<INotificationsRepository>();
                    await notificationsRepository.DeleteNotification();
                }
                await Task.Delay(TimeSpan.FromDays(DELETE_DAYS_INTERVAL), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("DeleteOldNotificationsBackgroundService is shutting down...");
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while deleting old notifications: " + ex.Message);
                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}