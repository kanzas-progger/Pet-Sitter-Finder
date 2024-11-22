using Auth.API.Contracts.Requests;
using Auth.Core.Abstractions;
using Auth.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auth.API.Controllers;



[ApiController]
[Route("api/authentication")]
[Authorize]
public class UsersController : ControllerBase
{
    private const int MIN_PASSWORD_LENGTH = 8;
    private const int MAX_PASSWORD_LENGTH = 32;
    private readonly string OwnerRole = Role.Owner.ToString().ToLower();
    private readonly string SitterRole = Role.Sitter.ToString().ToLower();
    
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

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
        
        string jwtToken = await _usersService.Register(request.login, request.password, request.firstname,
            request.lastname, request.age, request.role);
        
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
    [Authorize(Roles = "Admin,Sitter,Owner")]
    public async Task<ActionResult> Logout()
    {
        Response.Cookies.Delete("coockies");
        return Ok("Logged out");
    }

    [HttpPost("test")]
    [AllowAnonymous]
    public IActionResult TestGet()
    {
        return Ok("Good!");
    }
    
    [HttpPost("test2")]
    [Authorize(Roles = "Admin,Sitter,Owner")]
    public IActionResult TestGet2()
    {
        return Ok("Good! You're logged in");
    }

}