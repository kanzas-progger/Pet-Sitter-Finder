using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.API.Contracts.Requests;
using Reviews.Core.Abstractions;

namespace Reviews.API.Controllers;

[ApiController]
[Route("api/reviews")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IReviewsService _reviewsService;

    public ReviewsController(IReviewsService reviewsService)
    {
        _reviewsService = reviewsService;
    }
    
    [HttpPost("create")]
    [Authorize(Roles = "Owner, Admin")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateReviewRequest request)
    {
        var response = await _reviewsService.Create(request.sitterId, request.senderId,
            request.stars, request.content);

        await _reviewsService.UpdateSitterRating(request.sitterId);
        
        return Ok(response);
    }

    [HttpPut("update")]
    [Authorize(Roles = "Owner, Admin")]
    public async Task<ActionResult<Guid>> Update([FromBody] UpdateReviewRequest request)
    {
        var senderId = GetUserIdFromClaim();
        
        var response = await _reviewsService.Update(request.reviewId, senderId, request.stars, 
            request.content);
        
        return Ok(response);
    }

    [HttpDelete("delete")]
    [Authorize(Roles = "Owner, Admin, Sitter")]
    public async Task<ActionResult<Guid>> Delete([FromBody] DeleteReviewRequest request)
    {
        var response = await _reviewsService.Delete(request.reviewId);
        await _reviewsService.UpdateSitterRating(request.sitterId);
        
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