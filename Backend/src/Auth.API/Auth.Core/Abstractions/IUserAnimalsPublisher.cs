namespace Auth.Core.Abstractions;

public interface IUserAnimalsPublisher
{
    Task SendMessage<T>(T message);
}