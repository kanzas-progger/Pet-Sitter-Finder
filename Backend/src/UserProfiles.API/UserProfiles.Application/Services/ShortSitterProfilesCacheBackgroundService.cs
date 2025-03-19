    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using UserProfiles.Core.Abstractions;

    namespace UserProfiles.Application.Services;

    public class ShortSitterProfilesCacheBackgroundService : BackgroundService
    {
        
        private const int CACHE_UPDATE_MINUTES_INTERVAL = 5;
        private readonly IServiceProvider _serviceProvider;

        public ShortSitterProfilesCacheBackgroundService(IServiceProvider serviceProvider)
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
                        var shortSitterProfilesCacheService = scope.ServiceProvider
                            .GetRequiredService<IShortSitterProfilesCacheService>();
                        await shortSitterProfilesCacheService.SetData();
                    }
                    await Task.Delay(TimeSpan.FromMinutes(CACHE_UPDATE_MINUTES_INTERVAL), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine("ShortSitterProfilesCacheBackgroundService is shutting down...");
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error while executing ShortSitterProfilesCacheService: " + ex.Message);
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }
    }