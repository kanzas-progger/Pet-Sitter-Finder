using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;

namespace UserProfiles.Application.Services;

public class SitterProfileService : ISitterProfileService
{
    private readonly ISitterProfilesRepository _sitterProfilesRepository;

    public SitterProfileService(ISitterProfilesRepository sitterProfilesRepository)
    {
        _sitterProfilesRepository = sitterProfilesRepository;
    }

    public async Task<List<SitterProfile>> GetAllProfiles()
    {
        return await _sitterProfilesRepository.GetAll();
    }
}