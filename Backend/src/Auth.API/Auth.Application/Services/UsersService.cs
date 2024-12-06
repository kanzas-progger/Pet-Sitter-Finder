using System.ComponentModel.DataAnnotations;
using Auth.Core.Abstractions;
using Auth.Core.Models;
using SharedLibrary.RabbitMQ.DTOs;

namespace Auth.Application.Services;

public class UsersService : IUsersService
{
    private readonly IUsersRepository _usersRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IRegisterUserPublisher _registerUserPublisher;

    public UsersService(IUsersRepository usersRepository, IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider, IRegisterUserPublisher registerUserPublisher)
    {
        _usersRepository = usersRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
        _registerUserPublisher = registerUserPublisher;
    }

    public async Task<string> Register(string login, string password, string firstname, 
        string lastname, int age, string role)
    {
        bool isLoginExists = await _usersRepository.CheckLoginExistance(login);
        if (isLoginExists)
        {
            throw new ValidationException("Login already exists");
        }
        
        string passwordHash = _passwordHasher.GeneratePasswordHash(password);
        
        var (newUser, error) = User.Create(Guid.NewGuid(), login, passwordHash, 
            firstname, lastname, age);
        if (!String.IsNullOrEmpty(error))
        {
            throw new ValidationException(error);
        }
        
        Guid newUserId = await _usersRepository.Create(newUser);
        bool isRoleAddedToUser = await _usersRepository.AddRole(newUserId, role);
        if (!isRoleAddedToUser)
        {
            throw new ValidationException("Role not added to user");
        }

        var registerUserDto = new CreateUserProfileDTO(newUserId, login, firstname, lastname, age);

        await _registerUserPublisher.SendMessage(registerUserDto, role);

        string jwtToken = await Login(login, password);
        
        return jwtToken;

    }

    public async Task<string> Login(string login, string password)
    {
        var user = await _usersRepository.GetUserByLogin(login);
        if (!(_passwordHasher.VerifyPassword(password, user.PasswordHash)))
        {
            throw new ValidationException("Invalid password");
        }

        var userRoles = await _usersRepository.GetRoles(user.Id);
        string jwtToken = _jwtProvider.GenerateJwtToken(user.Id, userRoles);
        
        return jwtToken;
    }
}