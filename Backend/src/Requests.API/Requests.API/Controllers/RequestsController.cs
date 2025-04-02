using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Requests.API.Contracts;
using Requests.Core.Abstractions;
using Requests.Core.Enums;
using Requests.Core.Models;
using Requests.Infrastructure.GrpcClients;

namespace Requests.API.Controllers;

[ApiController]
[Route("api/requests")]
[Authorize]
public class RequestsController : ControllerBase
{
    private readonly IRequestsService _requestsService;
    private readonly AnimalsGrpcClient _animalsGrpcClient;

    public RequestsController(IRequestsService requestsService, AnimalsGrpcClient animalsGrpcClient)
    {
        _requestsService = requestsService;
        _animalsGrpcClient = animalsGrpcClient;
    }

    [HttpPost]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<RequestResponse>> Create([FromBody] CreateRequest httpRequest)
    {
        var ownerId = GetUserIdFromClaim();
    
        bool isRequestExists = await _requestsService.IsRequestExisted(httpRequest.boardId, ownerId);
        if (isRequestExists)
            return BadRequest("Request is already existed with this board");
        
        var grpcResponse = await _animalsGrpcClient.GetListAnimals();
        var animalsGrpcResponse = grpcResponse.Animals;
        
        var domainRequestAnimals = new List<RequestAnimal>();
    
        foreach (var httpRequestAnimal in httpRequest.animals)
        {
            var animal = animalsGrpcResponse.FirstOrDefault(a => a.Name.ToLower() == httpRequestAnimal.name.ToLower());
            if (animal == null)
                return BadRequest("Invalid animal name");
    
            var newRequestAnimal = new RequestAnimal
            {
                AnimalId = animal.AnimalId,
                Count = httpRequestAnimal.count,
                AnimalProfileId = httpRequestAnimal.animalProfileId
            };
            
            domainRequestAnimals.Add(newRequestAnimal);
        }
        
        var (request, error) = Requests.Core.Models.Request.Create(
            Guid.NewGuid(),
            httpRequest.boardId,
            httpRequest.sitterId,
            ownerId,
            domainRequestAnimals,
            httpRequest.totalPrice,
            Status.New,
            httpRequest.startDate,
            httpRequest.endDate,
            httpRequest.ownerMessage,
            DateTime.UtcNow
        );
    
        if (!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        var newRequest = await _requestsService.Create(request);
    
        var response = new RequestResponse(
            newRequest.Id,
            newRequest.SitterId,
            newRequest.OwnerId,
            newRequest.RequestAnimals
                .Select(ra => new RequestAnimalsResponse(
                    animalsGrpcResponse
                        .Where(a => a.AnimalId == ra.AnimalId)
                        .Select(a => a.Name)
                        .FirstOrDefault() ?? "Error",
                    ra.Count,
                    ra.AnimalProfileId))
                .ToList(),
            newRequest.TotalPrice,
            newRequest.Status.ToString(),
            newRequest.StartDate,
            newRequest.EndDate,
            newRequest.OwnerMessage,
            newRequest.CreatedAt);
        
        return Ok(response);
    }

    [HttpGet]
    [Authorize(Roles = "Owner, Sitter")]
    public async Task<ActionResult<List<RequestResponse>>> GetAllForUser()
    {
        var userId = GetUserIdFromClaim();
        
        var grpcResponse = await _animalsGrpcClient.GetListAnimals();
        var animalsGrpcResponse = grpcResponse.Animals;
        
        
        var requests = await _requestsService.GetAllForUser(userId);
        
        var response = requests.Select(r => new RequestResponse(
            r.Id,
            r.SitterId,
            r.OwnerId,
            r.RequestAnimals
                .Select(ra => new RequestAnimalsResponse(
                    animalsGrpcResponse
                        .Where(a => a.AnimalId == ra.AnimalId)
                        .Select(a => a.Name)
                        .FirstOrDefault() ?? "Error",
                    ra.Count,
                    ra.AnimalProfileId))
                .ToList(),
            r.TotalPrice,
            r.Status.ToString(),
            r.StartDate,
            r.EndDate,
            r.OwnerMessage,
            r.CreatedAt)).ToList();
        
        return Ok(response);
    }

    [HttpGet("{boardId:guid}")]
    [Authorize(Roles = "Owner, Sitter")]
    public async Task<IActionResult> GetAllDisabledDates(Guid boardId)
    {
        var response = await _requestsService.GetAllDisabledDatesForBoard(boardId);
        
        return Ok(response);
    }

    [HttpPut]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult<Status>> UpdateStatusBySitterToAccepted(UpdateStatusRequest httpRequest)
    {
        var response = await _requestsService.UpdateStatus(httpRequest.requestId, httpRequest.isDatesDisabled);
        
        return Ok(response);
    }

    [HttpDelete("{requestId:guid}")]
    [Authorize(Roles = "Owner, Sitter")]
    public async Task<ActionResult> DeleteRequest(Guid requestId)
    {
        await _requestsService.Delete(requestId);

        // To the future: make notification send with request data and sitter/owner message
        // with cause of rejected/canceled request
        
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