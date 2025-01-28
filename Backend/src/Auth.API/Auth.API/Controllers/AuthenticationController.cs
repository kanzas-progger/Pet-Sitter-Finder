using Auth.API.Contracts.Requests;
using Auth.API.Contracts.Responses;
using Auth.Core.Abstractions;
using Auth.Core.Enums;
using Auth.Infrastructure.GrpcClients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auth.API.Controllers;



[ApiController]
[Route("api/authentication")]
[Authorize]
public class AuthenticationController : ControllerBase
{
    private const int MIN_PASSWORD_LENGTH = 8;
    private const int MAX_PASSWORD_LENGTH = 32;
    private readonly string OwnerRole = Role.Owner.ToString().ToLower();
    private readonly string SitterRole = Role.Sitter.ToString().ToLower();
    
    private readonly IUsersService _usersService;
    
    private readonly AnimalsGrpcClient _animalsGrpcClient;

    public AuthenticationController(IUsersService usersService, AnimalsGrpcClient animalsGrpcClient)
    {
        _usersService = usersService;
        _animalsGrpcClient = animalsGrpcClient;
    }

    // [HttpGet("test")]
    // [AllowAnonymous]
    // public async Task<ActionResult<List<string>>> GetAnimals()
    // {
    //     var animals = await _animalsGrpcClient.GetListAnimals();
    //     var response = animals.Animals.Select(a => a.Name).ToList();
    //     return response;
    // }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<string>> Register([FromBody] RegisterUserRequest request)
    {
        if (request.password != request.confirmPassword)
            return BadRequest("Passwords do not match");
        if (request.password.Length < MIN_PASSWORD_LENGTH)
            return BadRequest($"Password length must be at least {MIN_PASSWORD_LENGTH} characters");
        if (request.password.Length > MAX_PASSWORD_LENGTH)
            return BadRequest($"Password length must be less than {MAX_PASSWORD_LENGTH} characters");
        
        if (request.role.ToLower() != OwnerRole && request.role.ToLower() != SitterRole)
            return BadRequest("Invalid role");
        
        List<int> animalIds = new List<int>();
        var animals = await _animalsGrpcClient.GetListAnimals();

        foreach (var animalName in request.animals)
        {
            var animal = animals.Animals.FirstOrDefault(a => a.Name.ToLower() == animalName.ToLower());
            if (animal == null)
                return BadRequest("Invalid animal name");
            
            animalIds.Add(animal.AnimalId);
        }
        
        string jwtToken = await _usersService.Register(request.login, request.password, request.firstname,
            request.lastname, request.age, animalIds, request.role);
        
        Response.Cookies.Append("coockies", jwtToken);
        
        return Ok(jwtToken);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<string>> Login([FromBody] LoginUserRequest request)
    {
        string jwtToken = await _usersService.Login(request.login, request.password);
        
        Response.Cookies.Append("coockies", jwtToken);
        
        return Ok(jwtToken);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<ActionResult> Logout()
    {
        Response.Cookies.Delete("coockies");
        return Ok("Logged out");
    }

    [HttpGet("{login}")]
    [AllowAnonymous]
    public async Task<ActionResult<UserIdWithRolesResponse>> GetUserByLogin(string login)
    {
        var user = await _usersService.GetUserIdWithRolesByLogin(login);
        
        var response = new UserIdWithRolesResponse(user.userId, user.roles);

        return Ok(response);
    }

}