namespace Boards.Core.Abstractions;

public interface IRedisCacheService
{
    Task<T> GetData<T>(string key);
}