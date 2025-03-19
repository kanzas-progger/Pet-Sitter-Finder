using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Requests.Core.Abstractions;

namespace Requests.Application.Services;

public class DeleteAcceptedRequestsBackgroundService : BackgroundService
{
    private const int DELETE_HOURS_INTERVAL = 1;
    private readonly IServiceProvider _serviceProvider;

    public DeleteAcceptedRequestsBackgroundService(IServiceProvider serviceProvider)
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
                    var requestsRepository = scope.ServiceProvider
                        .GetRequiredService<IRequestsRepository>();
                    await requestsRepository.DeleteAccepted();
                }
                await Task.Delay(TimeSpan.FromHours(DELETE_HOURS_INTERVAL), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("DeleteAcceptedRequestsBackgroundService is shutting down...");
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while deleting accepted requests: " + ex.Message);
                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}