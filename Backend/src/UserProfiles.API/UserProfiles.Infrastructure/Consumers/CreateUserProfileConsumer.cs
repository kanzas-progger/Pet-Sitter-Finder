using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedLibrary.RabbitMQ;
using SharedLibrary.RabbitMQ.DTOs;
using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;

namespace UserProfiles.Infrastructure.Consumers;

public class CreateUserProfileConsumer : ICreateUserProfileConsumer
{
    private const string ExchangeName = "user.registration";
    
    private const string OwnerQueueName = "register.owner.queue";
    private const string SitterQueueName = "register.sitter.queue";
    
    private const string OwnerRoutingKey = "user.register.owner";
    private const string SitterRoutingKey = "user.register.sitter";
    
    private readonly IRabbitMQService _rabbitMqService;
    private readonly IServiceProvider _serviceProvider;

    private IChannel? _channel;
    private IConnection? _connection;

    public CreateUserProfileConsumer(IRabbitMQService rabbitMqService, 
        IServiceProvider serviceProvider)
    {
        _rabbitMqService = rabbitMqService;
        _serviceProvider = serviceProvider;
    }

    public async Task StartConsuming()
    {
        
        try
        {
            await SetChannel();
            await SetExchangeAndQueues();
            await SetConsumers();
            
        }
        catch(Exception ex)
        {
            await Reconnect();
            Console.WriteLine(ex.Message);
        }
        
    }

    private async Task SetConsumers()
    {
        var ownerConsumer = new AsyncEventingBasicConsumer(_channel);
        var sitterConsumer = new AsyncEventingBasicConsumer(_channel);

        ownerConsumer.ReceivedAsync += async (sender, ea) => await HandleOwnerMessageAsync(sender, ea);
        sitterConsumer.ReceivedAsync += async (sender, ea) => await HandleSitterMessageAsync(sender, ea);

        await _channel.BasicConsumeAsync(OwnerQueueName, autoAck: true, consumer: ownerConsumer);
        await _channel.BasicConsumeAsync(SitterQueueName, autoAck: true, consumer: sitterConsumer);
    }

    private async Task SetChannel()
    {
        if (_channel?.IsOpen == true && _channel != null)
            return;
        
        _channel = await _rabbitMqService.CreateChannelAsync();

        if (_rabbitMqService.Connection != null)
        {
            _connection = _rabbitMqService.Connection;
            _connection.ConnectionShutdownAsync += async (sender, ea) => await Reconnect();
        }
        
    } 

    private async Task Reconnect()
    {
        while (true)
        {
            try
            {
                Console.WriteLine("MQ connection shut down. Attempting to reconnect. Retrying...");
                _connection?.Dispose();
                await SetChannel();
                await SetExchangeAndQueues();
                await SetConsumers();
                Console.WriteLine("Successfully connected");
                break;
            }

            catch (RabbitMQ.Client.Exceptions.BrokerUnreachableException ex)
            {
                
                Console.WriteLine(ex.Message);
                Console.WriteLine("connection:" + _connection.IsOpen);
                Console.WriteLine("channel: " + _channel.IsOpen);
                await Task.Delay(5000);
            }
        }
    }
    
    private async Task HandleOwnerMessageAsync(object sender, BasicDeliverEventArgs ea)
    {
        try
        {
            var body = ea.Body.ToArray();
            var content = Encoding.UTF8.GetString(body);

            var userData = JsonSerializer.Deserialize<CreateUserProfileDTO>(content);

            var ownerProfile = OwnerProfile.Create(Guid.NewGuid(), userData.userId, userData.login,
                userData.firstname, userData.lastname, string.Empty, userData.age, string.Empty,
                string.Empty, string.Empty, string.Empty, string.Empty, string.Empty,
                string.Empty).ownerProfile;
            
            using var scope = _serviceProvider.CreateScope();
            var ownerProfilesRepository = scope.ServiceProvider.GetRequiredService<IOwnerProfilesRepository>();
            await ownerProfilesRepository.Create(ownerProfile);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message); // Temporary!
        }
    }

    private async Task HandleSitterMessageAsync(object sender, BasicDeliverEventArgs ea)
    {
        try
        {
            var body = ea.Body.ToArray();
            var content = Encoding.UTF8.GetString(body);

            var userData = JsonSerializer.Deserialize<CreateUserProfileDTO>(content);

            var sitterProfile = SitterProfile.Create(Guid.NewGuid(), userData.userId, userData.login,
                userData.firstname, userData.lastname, string.Empty, userData.age, string.Empty,
                string.Empty, string.Empty, string.Empty, string.Empty, string.Empty,
                0, 0, string.Empty, 0).sitterProfile;

            
            using var scope = _serviceProvider.CreateScope();
            var sitterProfilesRepository = scope.ServiceProvider.GetRequiredService<ISitterProfilesRepository>();
            await sitterProfilesRepository.Create(sitterProfile);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message); // Temporary!
        }
    }

    private async Task SetExchangeAndQueues()
    {
        await _channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Direct,
            durable: true, autoDelete: false);

        var declareQueuesAndBinds = new[]
        {
            DeclareAndBindQueue(OwnerQueueName, OwnerRoutingKey),
            DeclareAndBindQueue(SitterQueueName, SitterRoutingKey)
        };
        
        await Task.WhenAll(declareQueuesAndBinds);
    }
        

    private async Task DeclareAndBindQueue(string queueName, string routingKey)
    {
        
        await _channel.QueueDeclareAsync(queue: queueName, durable: true, exclusive: false,
            autoDelete: false, arguments: null);
        
        await _channel.QueueBindAsync(queue: queueName, exchange: ExchangeName, 
            routingKey: routingKey);
    }
    
}