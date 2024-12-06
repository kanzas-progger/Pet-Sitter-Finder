namespace Auth.Core.Abstractions;

public interface IRegisterUserPublisher
{
    Task SendMessage<T>(T message, string role);
}