namespace UserProfiles.Core.Abstractions;

public interface IRedisCacheService
{
    Task SetData<T>(string key, T data);
}