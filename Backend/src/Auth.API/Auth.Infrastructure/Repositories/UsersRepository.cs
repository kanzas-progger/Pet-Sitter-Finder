using Auth.Core.Abstractions;
using Auth.Core.Common;
using Auth.Core.Enums;
using Auth.Core.Models;
using Auth.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure.Repositories;

public class UsersRepository : IUsersRepository
{
    private readonly AuthDbContext _context;

    public UsersRepository(AuthDbContext context)
    {
        _context = context;
    }
    
    public async Task<Guid> Create(User user)
    {
        var newUser = new UserEntity
        {
            Id = user.Id,
            Login = user.Login,
            PasswordHash = user.PasswordHash,
            Firstname = user.Firstname,
            Lastname = user.Lastname,
            Age = user.Age,
            RegistrationDate = DateTime.UtcNow,
        };
        
        await _context.Users.AddAsync(newUser);
        await _context.SaveChangesAsync();
        
        return newUser.Id;
    }

    public async Task<User> GetUserByLogin(string login)
    {
        var userEntity = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Login == login)
            ?? throw new CustomExceptions.UserNotFoundException();
        
        var userDomain = User.Create(userEntity.Id, userEntity.Login, userEntity.PasswordHash, userEntity.Firstname,
            userEntity.Lastname, userEntity.Age).user;
        
        return userDomain;
    }

    public async Task<bool> AddRole(Guid userId, string role)
    {
        var roleEntity = await _context.Roles.
            FirstOrDefaultAsync(r => r.Name.ToLower() == role.ToLower()) 
                         ?? throw new CustomExceptions.RoleNotFoundException(role);
        
        var userEntity = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId) 
                         ?? throw new CustomExceptions.UserNotFoundException();
        
        userEntity.Roles.Add(roleEntity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddAdminRole(Guid userId)
    {
        var adminRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == Role.Admin.ToString());
        
        var userEntity = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new CustomExceptions.UserNotFoundException();
        
        userEntity.Roles.Add(adminRole);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<List<string>> GetRoles(Guid userId)
    {
        var userRole = await _context.Users.AsNoTracking()
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == userId)
                        ?? throw new CustomExceptions.UserNotFoundException();

        return userRole.Roles.Select(r => r.Name).ToList();
    }
    
    public async Task<bool> CheckLoginExistance(string login)
    {
        return await _context.Users.AsNoTracking().AnyAsync(u => u.Login.ToLower() == login.ToLower());
    }
    
}