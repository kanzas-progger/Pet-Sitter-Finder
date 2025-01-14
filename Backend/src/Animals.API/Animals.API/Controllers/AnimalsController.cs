using Animals.API.Contracts;
using Animals.Core.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animals.API.Controllers;

[ApiController]
[Route("api/animals")]
[Authorize]
public class AnimalsController : ControllerBase
{
    private readonly IAnimalsService _animalsService;

    public AnimalsController(IAnimalsService animalsService)
    {
        _animalsService = animalsService;
    }

    [HttpPost("edit")]
    [Authorize(Roles = "Owner,Sitter")]
    public async Task<ActionResult> UpdateUserAnimals([FromBody] UpdateAnimalsRequest request)
    {
        Guid userId = GetUserIdFromClaim();
        List<int> animalIds = new List<int>();

        var allAnimals = await _animalsService.GetAllAnimals();

        foreach (string animalName in request.animals)
        {
            if (allAnimals.TryGetValue(animalName.ToLower(), out int animalId))
            {
                animalIds.Add(animalId);
            }
            else
            {
                return BadRequest("Invalid animal name");
            }
        }
        
        await _animalsService.UpdateUserAnimals(userId, animalIds);

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