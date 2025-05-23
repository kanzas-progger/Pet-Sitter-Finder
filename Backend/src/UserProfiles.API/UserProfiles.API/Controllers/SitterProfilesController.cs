using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserProfiles.API.Contracts.Requests;
using UserProfiles.API.Contracts.Responses;
using UserProfiles.Core.Abstractions;
using UserProfiles.Core.Models;
using UserProfiles.Infrastructure.GrpcClients;

namespace UserProfiles.API.Controllers;

[ApiController]
[Route("/api/sitters")]
[Authorize]
public class SitterProfilesController : ControllerBase
{
    private const int MAX_PHOTO_PROFILE_COUNT = 20;
    
    private readonly ReviewsGrpcClient _reviewsGrpcClient;
    private readonly ISitterProfileService _sitterProfileService;
    private readonly AnimalsGrpcClient _animalsGrpcClient;
    private readonly IImagesService _imagesService;

    public SitterProfilesController(ReviewsGrpcClient reviewsGrpcClient,
        ISitterProfileService sitterProfileService, AnimalsGrpcClient animalsGrpcClient,
        IImagesService imagesService)
    {
        _reviewsGrpcClient = reviewsGrpcClient;
        _sitterProfileService = sitterProfileService;
        _animalsGrpcClient = animalsGrpcClient;
        _imagesService = imagesService;
    }
    
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<SitterProfileResponseForAnnonymous>>> GetShortSitterProfiles()
    {
        var profiles = await _sitterProfileService.GetAllProfiles();
        var tasks = profiles.Select(async p =>
        {
            List<string> animalNames = new List<string>();
            string profileImagePath = string.Empty;
            
            try
            {
                var animalsForProfile = await _animalsGrpcClient.GetAnimalsListForUser(p.SitterId);
                animalNames = animalsForProfile.AnimalsForUser.Select(n => n.Name).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error of receiving animals for sitter with id: " + p.SitterId);
                Console.WriteLine(ex.Message);
            }
            
            if (!string.IsNullOrEmpty(p.ProfileImagePath))
            {
                string profileImage = Path.GetFileName(p.ProfileImagePath);
                profileImagePath = $"/uploads/img/{profileImage}";
            }
            
            return new SitterProfileResponseForAnnonymous(
                p.Id,
                p.SitterId,
                p.Login, 
                p.Firstname,
                p.Lastname, 
                profileImagePath,
                p.Country, 
                p.City,
                p.Address,
                p.Rating,
                p.RateCount,
                p.PricePerDay,
                animalNames);
        });
        
        var response = await Task.WhenAll(tasks);
        
        return Ok(response);
    }
    
    [HttpGet("anonymous/profile/short/{sitterId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ShortSitterProfileResponse>> GetShortSitterProfile(Guid sitterId)
    {
        string profileImagePath = string.Empty;
        var sitterProfile = await _sitterProfileService.GetProfileById(sitterId);
        
        if (!string.IsNullOrEmpty(sitterProfile.ProfileImagePath))
        {
            string profileImage = Path.GetFileName(sitterProfile.ProfileImagePath);
            profileImagePath = $"/uploads/img/{profileImage}";
        }

        var response = new ShortSitterProfileResponse(
            sitterId,
            sitterProfile.Firstname,
            sitterProfile.Lastname,
            sitterProfile.Login,
            profileImagePath);
        
        return Ok(response);
    }

    [HttpGet("anonymous/profile/full/{sitterId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<SitterFullProfileResponse>> GetFullSitterProfile(Guid sitterId)
    {
        List<string> animalNames = new List<string>();
        List<SitterReviewResponse> reviewsResponse = new List<SitterReviewResponse>();
        
        var sitterProfile = await _sitterProfileService.GetProfileById(sitterId);

        try
        {
            var animalsForProfile = await _animalsGrpcClient.GetAnimalsListForUser(sitterId);
            animalNames = animalsForProfile.AnimalsForUser.Select(n => n.Name).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error of receiving animals");
            Console.WriteLine(ex.Message);
        }

        try
        {
            var reviews = await _reviewsGrpcClient.GetReviews(sitterId);
            reviewsResponse = reviews.Reviews.Select(r => new SitterReviewResponse(
                Guid.Parse(r.ReviewId), 
                Guid.Parse(r.SitterId),
                Guid.Parse(r.SenderId), 
                r.Stars, 
                r.Content,
                r.CreationDate.ToDateTime(), 
                r.ExpirationToUpdateAndDelete.ToDateTime())).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error of receiving reviews");
            Console.WriteLine(ex.Message);
        }
        
        var sitterProfilePhotos = await _sitterProfileService.GetAllProfilePhotos(sitterId);
        
        string profileImagePath = string.Empty;
        if (!string.IsNullOrEmpty(sitterProfile.ProfileImagePath))
        {
            string profileImage = Path.GetFileName(sitterProfile.ProfileImagePath);
            profileImagePath = $"/uploads/img/{profileImage}";
        }
        
        List<string> profilePhotos = new List<string>();
        if (sitterProfilePhotos.Count > 0)
        {
            string photoUrl;
            foreach (var photo in sitterProfilePhotos)
            {
                string photoName = Path.GetFileName(photo);
                photoUrl = $"/uploads/img/{photoName}";
                profilePhotos.Add(photoUrl);
            }
        }
        
        var response = new SitterFullProfileResponse(
            sitterProfile.Id,
            sitterProfile.SitterId,
            sitterProfile.Login,
            sitterProfile.Firstname,
            sitterProfile.Lastname,
            sitterProfile.Age,
            sitterProfile.Email,
            sitterProfile.PhoneNumber,
            profileImagePath,
            sitterProfile.Country,
            sitterProfile.City,
            sitterProfile.Address,
            sitterProfile.Rating,
            sitterProfile.RateCount,
            sitterProfile.About,
            sitterProfile.PricePerDay,
            profilePhotos,
            animalNames,
            reviewsResponse
            );
        
        return Ok(response);
    }

    [HttpGet("profile/personal/edit")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult<EditSitterProfileById>> GetEditSitterProfileById()
    {
        List<string> animalNames = new List<string>();
        var sitterId = GetUserIdFromClaim();
        var sitterProfile = await _sitterProfileService.GetProfileById(sitterId);
        var sitterProfilePhotos = await _sitterProfileService.GetAllProfilePhotos(sitterId);
        
        string profileImagePath = string.Empty;
        if (!string.IsNullOrEmpty(sitterProfile.ProfileImagePath))
        {
            string profileImage = Path.GetFileName(sitterProfile.ProfileImagePath);
            profileImagePath = $"/uploads/img/{profileImage}";
        }

        try
        {
            var animalsForProfile = await _animalsGrpcClient.GetAnimalsListForUser(sitterId);
            animalNames = animalsForProfile.AnimalsForUser.Select(n => n.Name).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error of receiving animals");
            Console.WriteLine(ex.Message);
        }

        // List<string> profilePhotos = new List<string>();
        // if (sitterProfilePhotos.Count > 0)
        // {
        //     foreach (var photo in sitterProfilePhotos)
        //     {
        //         string photoUrl = $"/uploads/img/{Path.GetFileName(photo)}";
        //         profilePhotos.Add(photoUrl);
        //     }
        // } 
        
        var response = new EditSitterProfileById(
            sitterProfile.Id, 
            sitterId,
            sitterProfile.Login, 
            sitterProfile.Firstname, 
            sitterProfile.Lastname,
            sitterProfile.Fathername,
            sitterProfile.Email, 
            sitterProfile.PhoneNumber,
            profileImagePath,
            sitterProfilePhotos, 
            sitterProfile.Country, 
            sitterProfile.City, 
            sitterProfile.Address, 
            sitterProfile.About, 
            sitterProfile.PricePerDay,
            animalNames);
        
        return Ok(response);
    }

    [HttpPut("profile/personal/edit")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult<Guid>> UpdateSitterProfile(UpdateSitterProfileRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        var existingProfile = await _sitterProfileService.GetProfileById(userId);
        
        var (profileToUpdate, error) = SitterProfile.Create(
            existingProfile.Id, 
            existingProfile.SitterId,
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
            existingProfile.Rating,
            existingProfile.RateCount,
            request.about,
            request.pricePerDay);
        
        if (!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        var response = await _sitterProfileService.UpdateSitterProfile(profileToUpdate);
        return Ok(response);
    }
    
    [HttpPut("profile/personal/edit/image")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult<Guid>> UpdateOwnerProfileImage([FromForm] UpdateProfileImageRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        string imagePath = await _imagesService.UploadImage(request.profileImage);
        
        await _sitterProfileService.UpdateSitterProfileImage(userId, imagePath);
        
        return Ok();
    }

    [HttpDelete("profile/personal/edit/image")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult> DeleteOwnerProfileImage()
    {
        Guid userId = GetUserIdFromClaim();
        string imagePath = await _sitterProfileService.GetSitterImageUrl(userId);
        
        if (string.IsNullOrEmpty(imagePath))
            return BadRequest("Profile image doesn't exist");
        
        string response = _imagesService.DeleteProfileImage(imagePath);
        if (string.IsNullOrEmpty(response))
            return BadRequest("Profile image not found");
        
        await _sitterProfileService.UpdateSitterProfileImage(userId, string.Empty);
        
        return Ok(response);
    }

    [HttpPost("profile/personal/edit/photos")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult> AddSitterProfilePhotos([FromForm] UpdateProfilePhotosRequest request)
    {
        Guid sitterId = GetUserIdFromClaim();
        int currentCountProfilePhotos = await _sitterProfileService.GetProfilePhotoCount(sitterId);

        if (currentCountProfilePhotos + request.profilePhotos.Count > MAX_PHOTO_PROFILE_COUNT)
        {
            return BadRequest($"Too many profile photos. Max photo count is {MAX_PHOTO_PROFILE_COUNT}");
        }
        
        List<string> photoPaths = await _imagesService.UploadProfilePhotos(request.profilePhotos);
        await _sitterProfileService.AddSitterProfilePhotos(sitterId, photoPaths);
        
        return Ok();
    }

    [HttpDelete("profile/personal/delete/photo")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult> DeleteSitterProfilePhoto([FromBody] DeletePhotoRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        await _sitterProfileService.DeleteSitterProfilePhoto(userId, request.photoUrl);
        _imagesService.DeleteProfilePhoto(request.photoUrl);
        
        return Ok();
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