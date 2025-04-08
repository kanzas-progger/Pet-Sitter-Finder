using Boards.API.Contracts;
using Boards.Core.Abstractions;
using Boards.Core.Models;
using Boards.Core.Specifications;
using Boards.Infrastructure;
using Boards.Infrastructure.GrpcClients;
using Boards.Infrastructure.Repositories;
using Boards.Infrastructure.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharedLibrary.Redis.DTO_s;

namespace Boards.API.Controllers;

[ApiController]
[Route("api/boards")]
[Authorize]
public class BoardsController : ControllerBase
{
    private readonly IBoardsService _boardsService;
    private readonly IBoardAnimalsService _boardAnimalsService;
    private readonly AnimalsGrpcClient _animalsGrpcClient;
    private readonly IRedisCacheService _redisCacheService;

    public BoardsController(IBoardsService boardsService, AnimalsGrpcClient animalsGrpcClient,
        IBoardAnimalsService boardAnimalsService, IRedisCacheService redisCacheService)
    {
        _boardsService = boardsService;
        _boardAnimalsService = boardAnimalsService;
        _animalsGrpcClient = animalsGrpcClient;
        _redisCacheService = redisCacheService;
    }

    // [HttpPost("anonymous/test")]
    // [AllowAnonymous]
    // public async Task<ActionResult<List<Guid>>> GetBusyBoardsTest([FromBody] BoardFilter filter)
    // {
    //     var startDate = filter.startDate ?? DateTime.MinValue;
    //     var endDate = filter.endDate ?? DateTime.MaxValue;
    //     
    //     var grpcResponse = await _boardIdsGrpcClient.GetBusyBoardIds(startDate, endDate);
    //     var response = grpcResponse.BoardIds.Select(b => new Guid(b.BoardId_)).ToList();
    //     
    //     return Ok(response);
    //     
    // }
    
    [HttpPost("anonymous/filtered")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BoardSitterAgregateResponse>>> GetAllFilteredBoards([FromBody] BoardFilter filter)
    {
        var sitters = await _redisCacheService.GetData<List<ShortSitterProfileDto>>("ShortSitterProfiles_");
        var sittersDict = sitters.ToDictionary(s => s.sitterId);
        var animalsGrpcResponse = await _animalsGrpcClient.GetListAnimals();
        var animalIds = new List<int>();

        if (filter.animalNames != null && filter.animalNames.Any())
        {
            foreach (string animalName in filter.animalNames)
            {
                var animal = animalsGrpcResponse.Animals
                    .FirstOrDefault(a => a.Name.ToLower() == animalName.ToLower());
                if (animal == null)
                    return BadRequest("Invalid animal name");
                animalIds.Add(animal.AnimalId);
            }
        }
        
        var boards = await _boardsService.GetFiltered(filter.maxPrice, animalIds, 
            filter.startDate, filter.endDate);
        
        var result = boards
            .Where(b => sittersDict.ContainsKey(b.SitterId))
            .GroupBy(b => b.SitterId)
            .Select(g =>
            {
                var sitter = sittersDict[g.Key];
                var board = g.First();
                return new
                {
                    SitterId = g.Key,
                    Login = sitter.login,
                    Firstname = sitter.firstname,
                    Lastname = sitter.lastname,
                    ProfileImage = sitter.profileImage,
                    City = sitter.city,
                    Address = sitter.address,
                    Rating = sitter.rating,
                    RateCount = sitter.rateCount,
                    Content = board.Content,
                    AnimalIds = board.AnimalIds,
                    Price = board.Price,
                };
            })
            .OrderByDescending(s => sitters.First(b => b.sitterId == s.SitterId).rating)
            .ThenByDescending(s => sitters.First(b => b.sitterId == s.SitterId).rateCount);

        string staticProfileImagePath = "/uploads/img";
        var response = result.Select(b => new BoardSitterAgregateResponse(
            b.SitterId,
            b.Login,
            b.Firstname,
            b.Lastname,
            $"{staticProfileImagePath}/{Path.GetFileName(b.ProfileImage)}",
            b.City,
            b.Address,
            b.Rating,
            b.RateCount,
            b.Content,
            animalsGrpcResponse.Animals
                .Where(a => b.AnimalIds.Contains(a.AnimalId))
                .Select(a => a.Name)
                .ToList(),
            b.Price));
    
        return Ok(response);
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

    [HttpGet("anonymous/{sitterId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BoardResponse>>> GetAllForSitter(Guid sitterId)
    {
        var boards = await _boardsService.GetAllForSitter(sitterId);
        var animalsGrpcResponse = await _animalsGrpcClient.GetListAnimals();
        
        var response = boards.Select(b => new BoardResponse(
            b.Id, 
            b.SitterId,
            animalsGrpcResponse.Animals
                .Where(a => b.AnimalIds.Contains(a.AnimalId))
                .Select(a => a.Name)
                .ToList(),
            b.Content, 
            b.Price, 
            b.CreatedAt)).ToList();
        
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
        
        var boardAnimalIds = await _boardAnimalsService.GetAnimalIdsForBoard(request.boardId);
        var existingAnimalIds = (await _boardAnimalsService.GetBoardAnimalsForSitter(sitterId))
            .Except(boardAnimalIds)
            .ToList();
        
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