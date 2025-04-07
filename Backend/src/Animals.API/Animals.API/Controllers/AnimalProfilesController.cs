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
    public async Task<ActionResult<AnimalProfileResponse>> Create([FromForm] CreateAnimalProfileRequest request)
    {
        var ownerId = GetUserIdFromClaim();
        
        var ownerAnimals = await _animalsService.GetUserAnimals(ownerId);
        if (ownerAnimals.Count == 0 || !ownerAnimals.Contains(request.animalName, StringComparer.OrdinalIgnoreCase))
             return BadRequest("Invalid animal name. Please enter your valid name from your animals");
        
        int animalId = await _animalProfilesService.GetAnimalIdByName(request.animalName);
        
        string profileImage = String.Empty;
        if (request.profileImage != null)
        {
            string imageUrl = await _animalsProfileImageProvider.SaveImage(request.profileImage);
            profileImage = imageUrl;
        }
        
        var (newAnimalProfile, error) = AnimalProfile.Create(
            Guid.NewGuid(),
            animalId,
            ownerId,
            request.name,
            request.birthday,
            request.gender,
            request.type ?? "не указано",
            request.count,
            request.description ?? string.Empty,
            profileImage
        );
        
        if(!string.IsNullOrEmpty(error))
            return BadRequest(error);
    
        var animalProfile = await _animalProfilesService.Create(newAnimalProfile);
        
        var response = new AnimalProfileResponse(
            animalProfile.Id, 
            animalProfile.AnimalId,
            animalProfile.OwnerId,
            request.animalName,
            animalProfile.Name,
            animalProfile.Birthday,
            animalProfile.Gender,
            animalProfile.Type,
            animalProfile.Count,
            animalProfile.Description,
            animalProfile.ProfileImage);
        
        return Ok(response);
    }
    
    [HttpPut]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<AnimalProfileResponse>> Update([FromForm] UpdateAnimalProfileRequest request)
    {
        var ownerId = GetUserIdFromClaim();
        
        var ownerAnimals = await _animalsService.GetUserAnimals(ownerId);
        if (ownerAnimals.Count == 0 || !ownerAnimals.Contains(request.animalName, StringComparer.OrdinalIgnoreCase))
            return BadRequest("Invalid animal name. Please enter your valid name from your animals");
        
        int animalId = await _animalProfilesService.GetAnimalIdByName(request.animalName);
        
        string profileImage = string.Empty;
        
        if (request.profileImage != null && !request.isProfileImageExist) // update profileImage and delete existing
        {
            if (request.existingProfileImage != null)
                _animalsProfileImageProvider.DeleteImage(request.existingProfileImage);
            
            string imageUrl = await _animalsProfileImageProvider.SaveImage(request.profileImage);
            await _animalProfilesService.UpdateAnimalProfileImage(request.animalProfileId, ownerId, imageUrl);
            profileImage = imageUrl;
        }

        if (request.profileImage == null && !request.isProfileImageExist) // delete profileImage
        {
            _animalsProfileImageProvider.DeleteImage(request.existingProfileImage);
            await _animalProfilesService.UpdateAnimalProfileImage(request.animalProfileId, ownerId, profileImage);
        }

        var (animalProfileToUpdate, error) = AnimalProfile.Create(
            request.animalProfileId,
            animalId,
            ownerId,
            request.name,
            request.birthday,
            request.gender,
            request.type ?? "не указано",
            request.count,
            request.description ?? string.Empty,
            string.Empty
        );
        
        if(!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        var updatedAnimalProfile = await _animalProfilesService.Update(animalProfileToUpdate);
        
        var response = new AnimalProfileResponse(
            updatedAnimalProfile.Id,
            updatedAnimalProfile.AnimalId,
            updatedAnimalProfile.OwnerId,
            request.animalName,
            updatedAnimalProfile.Name,
            updatedAnimalProfile.Birthday,
            updatedAnimalProfile.Gender,
            updatedAnimalProfile.Type,
            updatedAnimalProfile.Count,
            updatedAnimalProfile.Description,
            profileImage
        );
        
        return Ok(response);
    }
    
    [HttpGet("all/{ownerId:guid}")]
    [Authorize(Roles = "Owner, Sitter")]
    public async Task<ActionResult<List<AnimalProfileResponse>>> GetAllAnimalProfilesForOwner(Guid ownerId)
    {
        //var ownerId = GetUserIdFromClaim();
        
        var animalProfiles = await _animalProfilesService.GetAllForOwner(ownerId);
        var animalsDict = await _animalsService.GetAllAnimalsDict();

        var response = new List<AnimalProfileResponse>();

        foreach (var ap in animalProfiles)
        {
            // string profileImage = await _animalProfilesService.GetAnimalProfileImage(ap.Id);
            // if (!string.IsNullOrEmpty(profileImage))
            // {
            //     string fileName = Path.GetFileName(profileImage);
            //     profileImage = $"/animals/uploads/img/{fileName}";
            // }
            
            response.Add(new AnimalProfileResponse(
                ap.Id,
                ap.AnimalId,
                ap.OwnerId,
                animalsDict.GetValueOrDefault(ap.AnimalId, "Неизвестно"),
                ap.Name,
                ap.Birthday,
                ap.Gender,
                ap.Type,
                ap.Count,
                ap.Description,
                ap.ProfileImage
                ));
        }
        
        return Ok(response);
    }

    [HttpGet("{animalProfileId:guid}")]
    [Authorize(Roles = "Owner,Sitter")]
    public async Task<ActionResult<AnimalProfileResponse>> GetAnimalProfile(Guid animalProfileId)
    {
        var animalsDict = await _animalsService.GetAllAnimalsDict();
        var animalProfile = await _animalProfilesService.GetById(animalProfileId);

        var response = new AnimalProfileResponse(
            animalProfileId,
            animalProfile.AnimalId,
            animalProfile.OwnerId,
            animalsDict.GetValueOrDefault(animalProfile.AnimalId, "Неизвестно"),
            animalProfile.Name,
            animalProfile.Birthday,
            animalProfile.Gender,
            animalProfile.Type,
            animalProfile.Count,
            animalProfile.Description,
            animalProfile.ProfileImage
        );
        
        return Ok(response);
    }

    [HttpPost("shortProfiles")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<List<ShortAnimalProfileResponse>>> GetShortAnimalProfiles(
    [FromBody] List<string> animalNames)
    {
        var ownerId = GetUserIdFromClaim();
        var profiles = await _animalProfilesService.GetAnimalProfileData(animalNames, ownerId);
        
        var response = profiles.Select(p => new ShortAnimalProfileResponse(
            p.animalProfileId,
            p.animalName,
            p.name,
            p.count)
        ).ToList();
        
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
        
        string imageUrl = await _animalProfilesService.GetAnimalProfileImage(animalProfileId);
        _animalsProfileImageProvider.DeleteImage(imageUrl);
        
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