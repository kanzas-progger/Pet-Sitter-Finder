using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserProfiles.API.Contracts.Responses;
using UserProfiles.Core.Abstractions;
using UserProfiles.Infrastructure.GrpcClients;

namespace UserProfiles.API.Controllers;

[ApiController]
[Route("/api/sitters")]
//[Authorize]
public class SitterProfilesController : ControllerBase
{
    private readonly ReviewsGrpcClient _reviewsGrpcClient;
    private readonly ISitterProfileService _sitterProfileService;
    private readonly AnimalsGrpcClient _animalsGrpcClient;

    public SitterProfilesController(ReviewsGrpcClient reviewsGrpcClient,
        ISitterProfileService sitterProfileService, AnimalsGrpcClient animalsGrpcClient)
    {
        _reviewsGrpcClient = reviewsGrpcClient;
        _sitterProfileService = sitterProfileService;
        _animalsGrpcClient = animalsGrpcClient;
    }

    // [HttpGet("{sitterId}")]
    // public async Task<ActionResult<List<SitterReviewResponse>>> GetReviews(Guid sitterId)
    // {
    //     var reviews = await _reviewsGrpcClient.GetReviews(sitterId);
    //     var response = reviews.Reviews.Select(r => new SitterReviewResponse(Guid.Parse(r.ReviewId),
    //         Guid.Parse(r.SitterId), Guid.Parse(r.SenderId), r.Stars, r.Content,
    //         r.CreationDate.ToDateTime(), r.ExpirationToUpdateAndDelete.ToDateTime())).ToList();
    //     
    //     return Ok(response);
    // }

    [HttpGet]
    //[AllowAnonymous]
    public async Task<ActionResult<List<SitterProfileResponseForAnnonymous>>> GetShortSitterProfiles()
    {
        var profiles = await _sitterProfileService.GetAllProfiles();
        var tasks = profiles.Select(async p =>
        {
            var animalsForProfile = await _animalsGrpcClient.GetAnimalsListForUser(p.SitterId);
            var animalNames = animalsForProfile.AnimalsForUser.Select(n => n.Name).ToList();
            
            return new SitterProfileResponseForAnnonymous(
                p.Id,
                p.SitterId,
                p.Login, 
                p.Firstname,
                p.Lastname, 
                p.ProfileImagePath,
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
    
    [HttpGet("test")]
    [AllowAnonymous]
    public async Task<ActionResult<List<string>>> GetAnimals()
    {
        var animals = await _animalsGrpcClient.GetAnimalsList();
        var response = animals.Animals.Select(a => a.Name).ToList();
        return response;
    }
    
    
    
    
    
    
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