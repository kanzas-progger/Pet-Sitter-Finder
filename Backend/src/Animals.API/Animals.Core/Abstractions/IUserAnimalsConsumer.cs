namespace Animals.Core.Abstractions;

public interface IUserAnimalsConsumer
{
    Task StartConsuming();
    Task StopConsuming();
}