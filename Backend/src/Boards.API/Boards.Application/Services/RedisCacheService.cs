using System.Text.Json;
using Boards.Core.Abstractions;
using Microsoft.Extensions.Caching.Distributed;

namespace Boards.Application.Services;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDistributedCache _distributedCache;

    public RedisCacheService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    public async Task<T> GetData<T>(string key)
    {
        var data = await _distributedCache.GetStringAsync(key);
        if (data is null)
            return default;
        
        return JsonSerializer.Deserialize<T>(data)!;
    }
}