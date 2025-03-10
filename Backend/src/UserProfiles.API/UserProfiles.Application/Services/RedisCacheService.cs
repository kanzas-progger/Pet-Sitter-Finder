using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Application.Services;

public class RedisCacheService : IRedisCacheService
{
    public const int CACHE_EXPIRATION_MINUTES = 5;
    private readonly IDistributedCache _distributedCache;

    public RedisCacheService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    public async Task SetData<T>(string key, T data)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CACHE_EXPIRATION_MINUTES)
        };
        
        await _distributedCache.SetStringAsync(key, JsonSerializer.Serialize(data), options);
    }
}