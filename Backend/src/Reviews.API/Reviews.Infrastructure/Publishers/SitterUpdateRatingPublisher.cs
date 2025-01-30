using System.Text;
using System.Text.Json;
using Reviews.Core.Abstractions;

namespace Reviews.Infrastructure.Publishers;
using RabbitMQ.Client;
using SharedLibrary.RabbitMQ;

public class SitterUpdateRatingPublisher : ISitterUpdateRatingPublisher
{
    private const string ExchangeName = "sitter.update";
    private const string QueueName = "update.rating.queue";
    
    private readonly IRabbitMQService _rabbitMqService;

    public SitterUpdateRatingPublisher(IRabbitMQService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    public async Task SendMessage<T>(T message)
    {
        using var channel = await _rabbitMqService.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Fanout,
            durable: true, autoDelete: false);

        await channel.QueueDeclareAsync(queue: QueueName, durable: true, exclusive: false,
            autoDelete: false, arguments: null);
        
        await channel.QueueBindAsync(queue: QueueName, exchange: ExchangeName, routingKey: string.Empty);
        
        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        await channel.BasicPublishAsync(exchange: ExchangeName, routingKey: string.Empty, body: body);
        
    }
}