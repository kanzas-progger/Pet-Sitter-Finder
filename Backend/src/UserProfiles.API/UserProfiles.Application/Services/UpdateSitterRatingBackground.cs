using Microsoft.Extensions.Hosting;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Application.Services;

public class UpdateSitterRatingBackground : BackgroundService
{
    private readonly IUpdateSitterRatingConsumer _updateSitterRatingConsumer;

    public UpdateSitterRatingBackground(IUpdateSitterRatingConsumer updateSitterRatingConsumer)
    {
        _updateSitterRatingConsumer = updateSitterRatingConsumer;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await _updateSitterRatingConsumer.StartConsuming();
                break;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while starting sitterRatingUpdate consumer: " + ex.Message);
                await Task.Delay(5000, stoppingToken);
            }
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _updateSitterRatingConsumer.StopConsuming();
        await base.StopAsync(cancellationToken);
    }
}