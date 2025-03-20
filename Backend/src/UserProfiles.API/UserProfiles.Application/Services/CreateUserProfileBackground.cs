using Microsoft.Extensions.Hosting;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Application.Services;

public class CreateUserProfileBackground : BackgroundService
{
    private readonly ICreateUserProfileConsumer _createUserProfileConsumer;

    public CreateUserProfileBackground(ICreateUserProfileConsumer createUserProfileConsumer)
    {
        _createUserProfileConsumer = createUserProfileConsumer;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _createUserProfileConsumer.StartConsuming();
                    //break;
                    //await Task.Delay(Timeout.Infinite, stoppingToken);
                    await Task.Delay(-1, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    //Console.WriteLine("CreateUserProfileBackground is shutting down...");
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error while starting createUserProfile consumer: " + ex.Message);
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }
        finally
        {
            await _createUserProfileConsumer.StopConsuming();
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _createUserProfileConsumer.StopConsuming();
        await base.StopAsync(cancellationToken);
    }
}