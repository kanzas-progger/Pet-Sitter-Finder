using Boards.Core.Abstractions;
using Boards.Core.Models;
using Boards.Core.Specifications;
using Boards.Infrastructure.GrpcClients;

namespace Boards.Application.Services;

public class BoardsService : IBoardsService
{
    private readonly IBoardsRepository _boardsRepository;
    private readonly BoardIdsGrpcClient _boardIdsGrpcClient;

    public BoardsService(IBoardsRepository boardsRepository, BoardIdsGrpcClient
        boardIdsGrpcClient)
    {
        _boardsRepository = boardsRepository;
        _boardIdsGrpcClient = boardIdsGrpcClient;
    }

    public async Task<List<Board>> GetAllForSitter(Guid sitterId)
    {
        return await _boardsRepository.GetAllForSitter(sitterId);
    }
    

    public async Task<Board> Create(Board board)
    {
        return await _boardsRepository.Create(board);
    }

    public async Task<Board> Update(Board board)
    {
        return await _boardsRepository.Update(board);
    }

    public async Task Delete(Guid boardId, Guid sitterId)
    {
        await _boardsRepository.Delete(boardId, sitterId);
    }

    public async Task<List<Board>> GetFiltered(decimal? maxPrice, List<int>? animalIds,
        DateTime? startDate, DateTime? endDate)
    {
        if (!maxPrice.HasValue
            && (animalIds == null || animalIds.Count == 0)
            && !startDate.HasValue
            && !endDate.HasValue)
        {
            return await _boardsRepository.GetAll();
        }
        
        var specs = new List<IBoardSpecification>();
        
        if (maxPrice.HasValue)
            specs.Add(new BoardPriceSpecification(maxPrice.Value));
        if (animalIds?.Count > 0)
            specs.Add(new BoardAnimalsSpecification(animalIds));
        if (startDate.HasValue && endDate.HasValue)
        {
            var grpcResponse = await _boardIdsGrpcClient.GetBusyBoardIds(startDate.Value, endDate.Value);
            List<Guid> busyBoards = grpcResponse.BoardIds.Select(b => new Guid(b.BoardId_)).ToList();
            specs.Add(new BoardBusySpecification(busyBoards));
        }
        
        return await _boardsRepository.GetFiltered(specs.ToArray());
    }
}