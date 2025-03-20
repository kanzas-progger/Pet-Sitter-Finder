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
        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _updateSitterRatingConsumer.StartConsuming();
                    //break;
                    await Task.Delay(-1, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    //Console.WriteLine("UpdateSitterRatingBackground is shutting down...");
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error while starting sitterRatingUpdate consumer: " + ex.Message);
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }
        finally
        {
            await _updateSitterRatingConsumer.StopConsuming();
        }
        
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _updateSitterRatingConsumer.StopConsuming();
        await base.StopAsync(cancellationToken);
    }
}