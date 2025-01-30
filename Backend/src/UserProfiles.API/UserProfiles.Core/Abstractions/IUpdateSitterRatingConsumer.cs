namespace UserProfiles.Core.Abstractions;

public interface IUpdateSitterRatingConsumer
{
    Task StartConsuming();
    Task StopConsuming();
}