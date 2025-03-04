using Boards.Core.Abstractions;
using Boards.Core.Models;

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
}