using Animals.API.Contracts;
using Animals.Core.Abstractions;
using Animals.Core.Models;
using Animals.Infrastructure.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animals.API.Controllers;

[ApiController]
[Route("api/animals/profiles")]
[Authorize]
public class AnimalProfilesController : ControllerBase
{
    private readonly IAnimalProfilesService _animalProfilesService;
    private readonly IAnimalsService _animalsService;
    private readonly IAnimalProfileImagesProvider _animalsProfileImageProvider;

    public AnimalProfilesController(IAnimalProfilesService animalProfilesService,
        IAnimalsService animalsService, IAnimalProfileImagesProvider animalsProfileImageProvider)
    {
        _animalProfilesService = animalProfilesService;
        _animalsService = animalsService;
        _animalsProfileImageProvider = animalsProfileImageProvider;
    }

    [HttpPost]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<AnimalProfile>> Create([FromBody] CreateAnimalProfileRequest request)
    {
        var ownerId = GetUserIdFromClaim();
        
        var ownerAnimals = await _animalsService.GetUserAnimals(ownerId);
        if (ownerAnimals.Count == 0 || !ownerAnimals.Contains(request.animalName, StringComparer.OrdinalIgnoreCase))
             return BadRequest("Invalid animal name. Please enter your valid name from your animals");
        
        int animalId = await _animalProfilesService.GetAnimalIdByName(request.animalName);
        
        var (newAnimalProfile, error) = AnimalProfile.Create(
            Guid.NewGuid(),
            animalId,
            ownerId,
            request.name,
            request.birthday,
            request.gender,
            request.type,
            request.count,
            request.description,
            request.profileImage
        );
        
        if(!string.IsNullOrEmpty(error))
            return BadRequest(error);

        var animalProfile = await _animalProfilesService.Create(newAnimalProfile);
        
        return Ok(animalProfile);
    }

    [HttpPut]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<AnimalProfileResponse>> Update([FromBody] UpdateAnimalProfileRequest request)
    {
        var ownerId = GetUserIdFromClaim();
        
        var ownerAnimals = await _animalsService.GetUserAnimals(ownerId);
        if (ownerAnimals.Count == 0 || !ownerAnimals.Contains(request.animalName, StringComparer.OrdinalIgnoreCase))
            return BadRequest("Invalid animal name. Please enter your valid name from your animals");
        
        int animalId = await _animalProfilesService.GetAnimalIdByName(request.animalName);

        var (animalProfileToUpdate, error) = AnimalProfile.Create(
            request.animalProfileId,
            animalId,
            ownerId,
            request.name,
            request.birthday,
            request.gender,
            request.type,
            request.count,
            request.description,
            string.Empty
        );
        
        if(!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        var updatedAnimalProfile = await _animalProfilesService.Update(animalProfileToUpdate);
        var animalsDict = await _animalsService.GetAllAnimalsDict();
        
        var animalProfileImage = await _animalProfilesService.GetAnimalProfileImage(updatedAnimalProfile.Id);
        if (!string.IsNullOrEmpty(animalProfileImage))
        {
            string fileName = Path.GetFileName(animalProfileImage);
            animalProfileImage = $"/animals/uploads/img/{fileName}";
        }

        var response = new AnimalProfileResponse(
            updatedAnimalProfile.Id,
            updatedAnimalProfile.AnimalId,
            updatedAnimalProfile.OwnerId,
            animalsDict.GetValueOrDefault(updatedAnimalProfile.AnimalId, "Неизвестно"),
            updatedAnimalProfile.Name,
            updatedAnimalProfile.Birthday,
            updatedAnimalProfile.Gender,
            updatedAnimalProfile.Type,
            updatedAnimalProfile.Count,
            updatedAnimalProfile.Description,
            animalProfileImage
        );
        
        return Ok(response);
    }
    
    [HttpGet("all")]
    [Authorize(Roles = "Owner, Sitter")]
    public async Task<ActionResult<List<AnimalProfileResponse>>> GetAllAnimalProfilesForOwner()
    {
        var ownerId = GetUserIdFromClaim();
        
        var animalProfiles = await _animalProfilesService.GetAllForOwner(ownerId);
        var animalsDict = await _animalsService.GetAllAnimalsDict();

        var getAnimalProfilesTasks = animalProfiles.Select(async p =>
        {
            string profileImage = await _animalProfilesService.GetAnimalProfileImage(p.Id);
            if (!string.IsNullOrEmpty(profileImage))
            {
                string fileName = Path.GetFileName(profileImage);
                profileImage = $"/animals/uploads/img/{fileName}";
            }

            return new AnimalProfileResponse(
                p.Id,
                p.AnimalId,
                p.OwnerId,
                animalsDict.GetValueOrDefault(p.AnimalId, "Неизвестно"),
                p.Name,
                p.Birthday,
                p.Gender,
                p.Type,
                p.Count,
                p.Description,
                profileImage);
        });

        var response = await Task.WhenAll(getAnimalProfilesTasks);
        
        return Ok(response);
    }

    [HttpPost("image")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> UploadImage([FromForm] UploadAnimalProfileImageRequest request)
    {
        var ownerId = GetUserIdFromClaim();

        try
        {
            string imageUrl = await _animalsProfileImageProvider.SaveImage(request.image);
            await _animalProfilesService.UpdateAnimalProfileImage(request.animalProfileId, ownerId, imageUrl);
        }
        catch (Exception ex)
        {
            BadRequest(ex.Message);
        }
        
        return Ok();
    }

    [HttpDelete("image/{animalProfileId:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> DeleteImage(Guid animalProfileId)
    {
        var ownerId = GetUserIdFromClaim();
        
        string imageUrl = await _animalProfilesService.GetAnimalProfileImage(animalProfileId);
        if (string.IsNullOrEmpty(imageUrl))
            return BadRequest("Invalid animal profile image");
        
        _animalsProfileImageProvider.DeleteImage(imageUrl);
        await _animalProfilesService.UpdateAnimalProfileImage(animalProfileId,ownerId, string.Empty);
        
        return Ok();
    }

    [HttpDelete("{animalProfileId:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> Delete(Guid animalProfileId)
    {
        var ownerId = GetUserIdFromClaim();
        await _animalProfilesService.Delete(animalProfileId,ownerId);

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