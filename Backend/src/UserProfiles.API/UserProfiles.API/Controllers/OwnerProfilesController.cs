using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserProfiles.API.Contracts.Requests;
using UserProfiles.API.Contracts.Responses;
using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;

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

    [HttpPut("profile/personal/edit/")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<Guid>> UpdateOwnerProfilePersonal(UpdateOwnerProfileRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        var existingProfile = await _ownerProfilesService.GetOwnerProfileById(userId);
        var (profileToUpdate, error) = OwnerProfile.Create(
            existingProfile.Id, 
            existingProfile.OwnerId,
            existingProfile.Login, 
            string.IsNullOrEmpty(request.firstname)? existingProfile.Firstname : request.firstname,
            string.IsNullOrEmpty(request.lastname)? existingProfile.Lastname : request.lastname,
            request.fathername,
            existingProfile.Age,
            request.email,
            request.phoneNumber,
            existingProfile.ProfileImagePath,
            request.country,
            request.city,
            request.address,
            request.about);
        
        if (!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        var response = await _ownerProfilesService.UpdateOwnerProfile(profileToUpdate);
        return Ok(response);
    }
    
    [HttpPut("profile/personal/edit/image")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<Guid>> UpdateOwnerProfileImage([FromForm] UpdateProfileImageRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        string imagePath = await _imagesService.UploadImage(request.profileImage);
        
        await _ownerProfilesService.UpdateOwnerImage(userId, imagePath);
        
        return Ok();
    }

    [HttpDelete("profile/personal/edit/image")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> DeleteOwnerProfileImage()
    {
        Guid userId = GetUserIdFromClaim();
        string imagePath = await _ownerProfilesService.GetOwnerProfileImageUrl(userId);
        
        if (string.IsNullOrEmpty(imagePath))
            return BadRequest("Profile image doesn't exist");
        
        string response = _imagesService.DeleteProfileImage(imagePath);
        if (string.IsNullOrEmpty(response))
            return BadRequest("Profile image not found");
        
        await _ownerProfilesService.UpdateOwnerImage(userId, string.Empty);
        
        return Ok(response);
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
            ownerProfile.Firstname, ownerProfile.Lastname,ownerProfile.Fathername,
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