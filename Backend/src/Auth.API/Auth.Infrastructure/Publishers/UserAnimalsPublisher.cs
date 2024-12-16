using System.Text;
using System.Text.Json;
using Auth.Core.Abstractions;
using RabbitMQ.Client;
using SharedLibrary.RabbitMQ;

namespace Auth.Infrastructure.Publishers;

public class UserAnimalsPublisher : IUserAnimalsPublisher
{
    private const string ExchangeName = "user.registration";
    private const string QueueName = "register.animal.queue";
    private const string RoutingKey = "user.register.animal";
    
    private readonly IRabbitMQService _rabbitMqService;

    public UserAnimalsPublisher(IRabbitMQService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    public async Task SendMessage<T>(T message)
    {
        using var channel = await _rabbitMqService.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Direct,
            durable: true, autoDelete: false);

        await channel.QueueDeclareAsync(queue: QueueName, durable: true, exclusive: false,
            autoDelete: false, arguments: null);
        
        await channel.QueueBindAsync(queue: QueueName, exchange: ExchangeName, routingKey: RoutingKey);
        
        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        await channel.BasicPublishAsync(exchange: ExchangeName, routingKey: RoutingKey, body: body);
        
    }
}