using Boards.Core.Abstractions;
using Boards.Core.Models;
using Boards.Core.Specifications;

namespace Boards.Application.Services;

public class BoardsService : IBoardsService
{
    private readonly IBoardsRepository _boardsRepository;

    public BoardsService(IBoardsRepository boardsRepository)
    {
        _boardsRepository = boardsRepository;
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

    public async Task<List<Board>> GetFiltered(decimal? maxPrice, List<int>? animalIds)
    {
        if (!maxPrice.HasValue && (animalIds == null || animalIds.Count == 0))
            return await _boardsRepository.GetAll();
        
        var specs = new List<IBoardSpecification>();
        
        if (maxPrice.HasValue)
            specs.Add(new BoardPriceSpecification(maxPrice.Value));
        if (animalIds?.Count > 0)
            specs.Add(new BoardAnimalsSpecification(animalIds));
        
        return await _boardsRepository.GetFiltered(specs.ToArray());
    }
}