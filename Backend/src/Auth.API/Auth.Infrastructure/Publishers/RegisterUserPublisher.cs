using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json;
using Auth.Core.Abstractions;
using RabbitMQ.Client;
using SharedLibrary.RabbitMQ;

namespace Auth.Infrastructure.Publishers;

public class RegisterUserPublisher : IRegisterUserPublisher
{
    private const string ExchangeName = "user.registration";
    private readonly IRabbitMQService _rabbitMqService;

    public RegisterUserPublisher(IRabbitMQService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }
    
    public async Task SendMessage<T>(T message, string role)
    {
        
        var (queueName, routingKey) = GetQueueNameAndRoutingKey(role);
        
        using var channel = await _rabbitMqService.CreateChannelAsync();
        
        await channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Direct,
            durable: true, autoDelete: false);
        
        await channel.QueueDeclareAsync(queue: queueName, durable: true, exclusive:false,
            autoDelete:false, arguments: null);

        await channel.QueueBindAsync(queue: queueName, exchange: ExchangeName, routingKey: routingKey);
        
        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);
        
        await channel.BasicPublishAsync(exchange: ExchangeName, routingKey: routingKey, body: body);
    }

    private (string queueName, string routingKey) GetQueueNameAndRoutingKey(string role)
    {
        string queueName = String.Empty;
        string routingKey = String.Empty;

        if (role.ToLower() == "sitter")
        {
            queueName = "register.sitter.queue";
            routingKey = "user.register.sitter";
        }
        else if (role.ToLower() == "owner")
        {
            queueName = "register.owner.queue";
            routingKey = "user.register.owner";
        }
        else
        {
            throw new ValidationException("Invalid role");
        }
        
        return (queueName, routingKey);
    }
}