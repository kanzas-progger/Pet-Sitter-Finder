using System.Collections.Concurrent;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace SharedLibrary.RabbitMQ;

// Singleton 
public class RabbitMQService : IRabbitMQService, IDisposable
{
    private IConnection? _connection;
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
    public IConnection Connection => _connection;

    public async Task<IConnection> CreateConnectionAsync()
    {
        if (_connection != null && _connection.IsOpen) 
            return _connection;

        try
        {
            await _semaphore.WaitAsync();
            if (_connection != null && _connection.IsOpen)
                return _connection;
            
            _connection?.Dispose(); // Dispose connection after reconnection

            var factory = new ConnectionFactory
            {
                HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOSTNAME") ?? "localhost",
                UserName = "user",
                Password = "password123",
                AutomaticRecoveryEnabled = true,
                NetworkRecoveryInterval = TimeSpan.FromSeconds(10),
            };

            _connection = await factory.CreateConnectionAsync();
            return _connection;
        }
        // catch (Exception ex)
        // {
        //     throw new Exception($"Could not create connection: {ex.Message}");
        // }  /// it needs to make custom connection exception
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<IChannel> CreateChannelAsync()
    {
        var connection = await CreateConnectionAsync();
        var channel = await connection.CreateChannelAsync();
        return channel;
    }

    public async ValueTask DisposeAsync()
    {
        if (_connection != null)
        {
            await _connection.CloseAsync();
            await Task.Run(() => _connection.Dispose());
        }
        _semaphore.Dispose();
    }
    
    public void Dispose()
    {
        _connection?.Dispose();
        _semaphore.Dispose();
    }
    
}
