using Microsoft.Extensions.Caching.Memory;
using SharedLibrary.Redis.DTO_s;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.Application.Services;

public class ShortSitterProfilesCacheService : IShortSitterProfilesCacheService
{
    public const string REDIS_KEY = "ShortSitterProfiles_";
    private readonly IRedisCacheService _redisCacheService;
    private readonly ISitterProfilesRepository _sitterProfilesRepository;

    public ShortSitterProfilesCacheService(IRedisCacheService redisCacheService, 
        ISitterProfilesRepository sitterProfilesRepository)
    {
        _redisCacheService = redisCacheService;
        _sitterProfilesRepository = sitterProfilesRepository;
    }

    public async Task SetData()
    {
        var sitterProfiles = await _sitterProfilesRepository.GetAll();
        
        var data = sitterProfiles.Select(s => new ShortSitterProfileDto(
            s.SitterId,
            s.Firstname,
            s.Lastname,
            s.Login,
            s.ProfileImagePath,
            s.Country,
            s.City,
            s.Address,
            s.Rating,
            s.RateCount))
            .ToList();

        await _redisCacheService.SetData(REDIS_KEY, data);
    }
}