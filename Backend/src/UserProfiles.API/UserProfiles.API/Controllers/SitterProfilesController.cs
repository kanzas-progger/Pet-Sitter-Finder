using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.API.Controllers;

[ApiController]
[Route("/api/sitters")]
[Authorize]
public class SitterProfilesController : ControllerBase
{
    // private readonly ISitterProfilesService _ownerProfilesService;
    // private readonly IImagesService _imagesService;
    //
    // private const int MAX_PHOTO_PROFILE_COUNT = 20;
    // private Guid GetUserIdFromClaim()
    // {
    //     var userIdFromToken = User.FindFirst("id-")?.Value;
    //     Guid userId;
    //     if(userIdFromToken == null)
    //         throw new UnauthorizedAccessException();
    //
    //     Guid.TryParse(userIdFromToken, out userId);
    //
    //     return userId;
    // }
}