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

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await _createUserProfileConsumer.StartConsuming();
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while starting createUserProfile consumer: " + ex.Message);
                await Task.Delay(5000, stoppingToken);
            }
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _createUserProfileConsumer.StopConsuming();
        await base.StopAsync(cancellationToken);
    }
}