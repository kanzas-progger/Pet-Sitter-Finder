using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserProfiles.API.Contracts.OwnerProfiles.Requests;
using UserProfiles.API.Contracts.OwnerProfiles.Responses;
using UserProfiles.Core.Abstractions;

namespace UserProfiles.API.Controllers;


[ApiController]
[Route("api/owners")]
[Authorize]
public class OwnerProfilesController : ControllerBase
{
    private readonly IOwnerProfilesService _ownerProfilesService;
    private readonly IImagesService _imagesService;

    private const int MAX_PHOTO_PROFILE_COUNT = 20;

    public OwnerProfilesController(IOwnerProfilesService ownerProfilesService,
        IImagesService imagesService)
    {
        _ownerProfilesService = ownerProfilesService;
        _imagesService = imagesService;
    }
    
    [HttpPut("profile/personal/edit/image")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<Guid>> UpdateOwnerProfileImage([FromForm] UpdateOwnerProfileImageRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        string imagePath = await _imagesService.UploadImage(request.profileImage);
        
        await _ownerProfilesService.UpdateOwnerImage(userId, imagePath);
        
        return Ok();
    }

    [HttpPost("profile/personal/edit/photos")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> AddOwnerProfilePhotos([FromForm] List<IFormFile> profilePhotos)
    {
        Guid ownerId = GetUserIdFromClaim();
        int currentCountProfilePhotos = await _ownerProfilesService.GetOwnerProfilePhotoCount(ownerId);

        if (currentCountProfilePhotos + profilePhotos.Count > MAX_PHOTO_PROFILE_COUNT)
        {
            return BadRequest($"Too many profile photos. Max photo count is {MAX_PHOTO_PROFILE_COUNT}");
        }
        
        List<string> photoPaths = await _imagesService.UploadProfilePhotos(profilePhotos);
        
        await _ownerProfilesService.AddOwnerProfilePhotos(ownerId, photoPaths);
        
        return Ok();
        
    }

    [HttpGet("profile/personal/edit")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<OwnerProfileByIdResponse>> GetOwnerProfileById()
    {
        var ownerId = GetUserIdFromClaim();
        var ownerProfile = await _ownerProfilesService.GetOwnerProfileById(ownerId);
        var ownerProfilePhotos = await _ownerProfilesService.GetAllOwnerProfilePhotos(ownerId);
        
        var response = new OwnerProfileByIdResponse(ownerProfile.Id, ownerProfile.Login, 
            ownerProfile.Firstname, ownerProfile.Lastname,ownerProfile.Firstname,
            ownerProfile.Age, ownerProfile.ProfileImagePath, ownerProfile.Email, ownerProfile.PhoneNumber,
            ownerProfile.Country, ownerProfile.City, ownerProfile.Address, ownerProfile.About, ownerProfilePhotos);
        
        return Ok(response);
    }
    
    private Guid GetUserIdFromClaim()
    {
        var userIdFromToken = User.FindFirst("id-")?.Value;
        Guid userId;
        if(userIdFromToken == null)
            throw new UnauthorizedAccessException();

        Guid.TryParse(userIdFromToken, out userId);

        return userId;
    }
    
}