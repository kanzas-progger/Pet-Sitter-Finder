using Boards.Core.Models;

namespace Boards.Core.Abstractions;

public interface IBoardsService
{
    Task<List<Board>> GetAllForSitter(Guid sitterId);
    Task<Board> Create(Board board);
    Task<Board> Update(Board board);
    Task Delete(Guid boardId, Guid sitterId);
}