using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UserProfiles.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    [HttpGet("sitterAndOwnerAccess")]
    [Authorize(Roles = "Sitter,Owner")]
    public IActionResult GetSitterAndOwnerAccess()
    {
        return Ok("Successfully");
    }

    [HttpGet("onlyForAdmin")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetOnlyForAdmin()
    {
        return Ok("Successfully");
    }

    [HttpGet("annonymousSuccess")]
    [AllowAnonymous]
    public IActionResult GetAnonymousSuccess()
    {
        return Ok("Successfully");
    }
}