using Animals.Core.Abstractions;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;

namespace Animals.Application.Services;

public class UserAnimalsBackgroundService : BackgroundService
{
    private readonly IUserAnimalsConsumer _userAnimalsConsumer;

    public UserAnimalsBackgroundService(IUserAnimalsConsumer userAnimalsConsumer)
    {
        _userAnimalsConsumer = userAnimalsConsumer;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await _userAnimalsConsumer.StartConsuming();
                break;
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("UserAnimalsBackgroundService is shutting down...");
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while starting consumer: " + ex.Message);
                await Task.Delay(5000, stoppingToken);
            }
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _userAnimalsConsumer.StopConsuming();
        await base.StopAsync(cancellationToken);
    }
}