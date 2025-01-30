using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SharedLibrary.RabbitMQ;
using SharedLibrary.RabbitMQ.DTOs;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Infrastructure.Consumers;

public class UpdateSitterRatingConsumer : IUpdateSitterRatingConsumer
{
    private const string ExchangeName = "sitter.update";
    
    private const string QueueName = "update.rating.queue";
    
    private readonly IRabbitMQService _rabbitMqService;
    private readonly IServiceProvider _serviceProvider;

    private IChannel? _channel;
    private IConnection? _connection;
    
    private volatile bool _isShuttingDown;

    public UpdateSitterRatingConsumer(IRabbitMQService rabbitMqService, 
        IServiceProvider serviceProvider)
    {
        _rabbitMqService = rabbitMqService;
        _serviceProvider = serviceProvider;
        _isShuttingDown = false;
    }

    public async Task StartConsuming()
    {
        try
        {
            await SetChannel();
            await SetExchangeAndQueue();
            await SetConsumer();
            
        }
        catch(Exception ex)
        {
            await Reconnect();
            Console.WriteLine(ex.Message);
        }
        
    }
    
    public async Task StopConsuming()
    {
        _isShuttingDown = true;
        
        if (_channel != null && _channel.IsOpen)
        {
            await _channel.CloseAsync();
        }

        if (_connection != null && _connection.IsOpen)
        {
            await _connection.CloseAsync();
        }
    }

    private async Task SetConsumer()
    {
        var updateSitterRatingConsumer = new AsyncEventingBasicConsumer(_channel);
        
        updateSitterRatingConsumer.ReceivedAsync += async (sender, ea) => await HandleMessageAsync(sender, ea);

        await _channel.BasicConsumeAsync(QueueName, autoAck: true, consumer: updateSitterRatingConsumer);

    }

    private async Task SetChannel()
    {
        if (_channel?.IsOpen == true && _channel != null)
            return;
        
        _channel = await _rabbitMqService.CreateChannelAsync();

        if (_rabbitMqService.Connection != null)
        {
            _connection = _rabbitMqService.Connection;
            _connection.ConnectionShutdownAsync += async (sender, ea) =>
            {
                if (!_isShuttingDown)
                    await Reconnect();
            };
        }
    } 

    private async Task Reconnect()
    {
        while (!_isShuttingDown)
        {
            try
            {
                Console.WriteLine("MQ connection shut down. Attempting to reconnect. Retrying...");
                _connection?.Dispose();
                await SetChannel();
                await SetExchangeAndQueue();
                await SetConsumer();
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
    
    private async Task HandleMessageAsync(object sender, BasicDeliverEventArgs ea)
    {
        try
        {
            var body = ea.Body.ToArray();
            var content = Encoding.UTF8.GetString(body);

            var updateData = JsonSerializer.Deserialize<UpdateSitterRatingDTO>(content);
            
            using var scope = _serviceProvider.CreateScope();
            var sitterProfilesRepository = scope.ServiceProvider.GetRequiredService<ISitterProfilesRepository>();
            await sitterProfilesRepository.UpdateRating(updateData.sitterId, updateData.rating, updateData.rateCount);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message); // Temporary!
        }
    }
    
    private async Task SetExchangeAndQueue()
    {
        await _channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Fanout,
            durable: true, autoDelete: false);
        
        await _channel.QueueDeclareAsync(queue: QueueName, durable: true, exclusive: false,
            autoDelete: false, arguments: null);
        
        await _channel.QueueBindAsync(queue: QueueName, exchange: ExchangeName, 
            routingKey: string.Empty);
    }
}