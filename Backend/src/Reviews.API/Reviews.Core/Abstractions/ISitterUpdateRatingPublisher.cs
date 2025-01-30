namespace Reviews.Core.Abstractions;

public interface ISitterUpdateRatingPublisher
{
    Task SendMessage<T>(T message);
}