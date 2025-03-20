using RabbitMQ.Client;

namespace SharedLibrary.RabbitMQ;

public interface IRabbitMQService
{
    Task<IConnection> CreateConnectionAsync();
    Task<IChannel> CreateChannelAsync();
    IConnection Connection { get; }
    Task StopAsync();
}