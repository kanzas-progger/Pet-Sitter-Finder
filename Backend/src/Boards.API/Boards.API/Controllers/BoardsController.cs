using Boards.API.Contracts;
using Boards.Core.Abstractions;
using Boards.Core.Models;
using Boards.Infrastructure.GrpcClients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Boards.API.Controllers;

[ApiController]
[Route("api/boards")]
[Authorize]
public class BoardsController : ControllerBase
{
    private readonly IBoardsService _boardsService;
    private readonly IBoardAnimalsService _boardAnimalsService;
    private readonly AnimalsGrpcClient _animalsGrpcClient;

    public BoardsController(IBoardsService boardsService, AnimalsGrpcClient animalsGrpcClient,
        IBoardAnimalsService boardAnimalsService)
    {
        _boardsService = boardsService;
        _boardAnimalsService = boardAnimalsService;
        _animalsGrpcClient = animalsGrpcClient;
    }
    
    [HttpPost]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult<BoardResponse>> Create([FromBody] CreateBoardRequest request)
    {
        var sitterId = GetUserIdFromClaim();

        var animalIds = new List<int>();
        var animalsGrpcResponse = await _animalsGrpcClient.GetListAnimals();

        foreach (string animalName in request.animalNames)
        {
            var animal = animalsGrpcResponse.Animals
                .FirstOrDefault(a => a.Name.ToLower() == animalName.ToLower());
            if (animal == null)
                return BadRequest("Invalid animal name");
            
            animalIds.Add(animal.AnimalId);
        }
        
        var existingAnimalIds = await _boardAnimalsService.GetBoardAnimalsForSitter(sitterId);
        var intersection = animalIds.Intersect(existingAnimalIds).ToList();
        if (intersection.Any())
            return BadRequest("Existing animals cannot be intersect");
            
        var (newBoard, error) = Board.Create(Guid.NewGuid(), sitterId, animalIds, 
            request.content, request.price, DateTime.UtcNow);
        
        if (!string.IsNullOrEmpty(error))
            return BadRequest(error);
        
        var createdBoard = await _boardsService.Create(newBoard);

        var response = new BoardResponse(
            createdBoard.Id,
            createdBoard.SitterId,
            request.animalNames,
            createdBoard.Content,
            createdBoard.Price,
            createdBoard.CreatedAt
        );
        
        return Ok(response);
    }

    [HttpGet("{sitterId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BoardResponse>>> GetAllForSitter(Guid sitterId)
    {
        var boards = await _boardsService.GetAllForSitter(sitterId);
        var animalsGrpcResponse = await _animalsGrpcClient.GetListAnimals();
        
        var response = boards.Select(b => new BoardResponse(b.Id, b.SitterId,
            animalsGrpcResponse.Animals
                .Where(a => b.AnimalIds.Contains(a.AnimalId))
                .Select(a => a.Name)
                .ToList(),
            b.Content, b.Price, b.CreatedAt)).ToList();
        
        return Ok(response);
    }

    [HttpPut]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult<BoardResponse>> Update([FromBody] UpdateBoardRequest request)
    {
        var sitterId = GetUserIdFromClaim();
        
        var animalIds = new List<int>();
        var animalsGrpcResponse = await _animalsGrpcClient.GetListAnimals();

        foreach (string animalName in request.animalNames)
        {
            var animal = animalsGrpcResponse.Animals
                .FirstOrDefault(a => a.Name.ToLower() == animalName.ToLower());
            if (animal == null)
                return BadRequest("Invalid animal name");
            
            animalIds.Add(animal.AnimalId);
        }
        
        var existingAnimalIds = await _boardAnimalsService.GetBoardAnimalsForSitter(sitterId);
        var intersection = animalIds.Intersect(existingAnimalIds).ToList();
        if (intersection.Any())
            return BadRequest("Existing animals cannot be intersect");
        
        var existingBoard = Board.Create(request.boardId, sitterId, animalIds, 
            request.content, request.price, request.createdAt).newBoard;
        
        var updatedBoard = await _boardsService.Update(existingBoard);

        var response = new BoardResponse(
            updatedBoard.Id,
            updatedBoard.SitterId,
            request.animalNames,
            updatedBoard.Content,
            updatedBoard.Price,
            updatedBoard.CreatedAt
        );
        
        return Ok(response);
    }

    [HttpDelete("{boardId:guid}")]
    [Authorize(Roles = "Sitter")]
    public async Task<ActionResult> Delete(Guid boardId)
    {
        var sitterId = GetUserIdFromClaim();
        
        await _boardsService.Delete(boardId, sitterId);

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