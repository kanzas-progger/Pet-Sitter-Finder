using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UserProfiles.API.Controllers;

[ApiController]
[Route("/api/sitters")]
[Authorize]
public class SitterProfilesController : ControllerBase
{
    
}