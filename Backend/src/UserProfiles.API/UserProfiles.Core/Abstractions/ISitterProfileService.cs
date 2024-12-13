using UserProfiles.Core.Models;

namespace UserProfiles.Core.Abstractions;

public interface ISitterProfileService
{
    Task<List<SitterProfile>> GetAllProfiles();
}