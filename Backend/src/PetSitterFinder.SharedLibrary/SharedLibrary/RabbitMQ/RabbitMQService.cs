using System.Collections.Concurrent;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace SharedLibrary.RabbitMQ;

// Singleton 
public class RabbitMQService : IRabbitMQService, IDisposable
{
    private IConnection? _connection;
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
    private volatile bool _isShuttingDown;
    public IConnection Connection => _connection;

    public async Task<IConnection> CreateConnectionAsync()
    {
        if (_isShuttingDown)
        {
            throw new OperationCanceledException();
        }
        
        if (_connection != null && _connection.IsOpen) 
            return _connection;

        await _semaphore.WaitAsync();
        
        try
        {
            if (_connection != null && _connection.IsOpen)
                return _connection;
            
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
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task StopAsync()
    {
        _isShuttingDown = true;
        try
        {
            if (_connection != null && _connection.IsOpen)
            {
                await _connection.CloseAsync();
                //_connection.Dispose();
                //_connection = null;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error closing connection: " + ex.Message);
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
