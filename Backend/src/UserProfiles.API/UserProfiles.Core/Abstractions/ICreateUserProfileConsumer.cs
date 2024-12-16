namespace UserProfiles.Core.Abstractions;

public interface ICreateUserProfileConsumer
{
    Task StartConsuming();
    Task StopConsuming();
}