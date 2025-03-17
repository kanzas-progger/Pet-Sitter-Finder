using Boards.Core.Abstractions;

namespace Boards.Application.Services;

public class BoardAnimalsService : IBoardAnimalsService
{
    private readonly IBoardAnimalsRepository _boardAnimalsRepository;

    public BoardAnimalsService(IBoardAnimalsRepository boardAnimalsRepository)
    {
        _boardAnimalsRepository = boardAnimalsRepository;
    }

    public async Task<List<int>> GetBoardAnimalsForSitter(Guid sitterId)
    {
        return await _boardAnimalsRepository.GetBoardAnimalsForSitter(sitterId);
    }
    
    public async Task<List<int>> GetAnimalIdsForBoard(Guid boardId)
    {
        return await _boardAnimalsRepository.GetAnimalIdsForBoard(boardId);
    }
}