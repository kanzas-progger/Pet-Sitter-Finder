using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.API.Contracts.Requests;
using Reviews.Core.Abstractions;

namespace Reviews.API.Controllers;

[ApiController]
[Route("api/reviews")]
[Authorize(Roles="Admin,Sitter,Owner")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewsService _reviewsService;

    public ReviewsController(IReviewsService reviewsService)
    {
        _reviewsService = reviewsService;
    }

    [HttpPost("api/reviews/create")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateReviewRequest request)
    {
        var response = await _reviewsService.Create(request.sitterId, request.senderId,
            request.stars, request.content);
        
        return Ok(response);
    }

    [HttpPut("api/reviews/update")]
    public async Task<ActionResult<Guid>> Update([FromBody] UpdateReviewRequest request)
    {
        var senderId = GetUserIdFromClaim();
        
        var response = await _reviewsService.Update(request.reviewId, senderId, request.stars, 
            request.content);
        
        return Ok(response);
    }

    [HttpDelete("api/reviews/delete/{reviewId:guid}")]
    public async Task<ActionResult<Guid>> Delete(Guid reviewId)
    {
        var response = await _reviewsService.Delete(reviewId);
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