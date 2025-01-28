using Auth.Core.Models;

namespace Auth.Core.Abstractions;

public interface IUsersRepository
{
    Task<Guid> Create(User user);
    Task<User> GetUserByLogin(string login);
    Task<bool> AddRole(Guid userId, string role);
    Task<bool> AddAdminRole(Guid userId);
    Task<List<string>> GetRoles(Guid userId);
    Task<bool> CheckLoginExistance(string login);
    Task<(Guid userId, List<string> roles)> GetUserIdWithRolesByLogin(string login);
}