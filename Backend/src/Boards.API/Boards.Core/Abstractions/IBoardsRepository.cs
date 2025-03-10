using Boards.Core.Models;
using Boards.Core.Specifications;

namespace Boards.Core.Abstractions;

public interface IBoardsRepository
{
    Task<Board> Create(Board board);
    Task<List<Board>> GetAllForSitter(Guid sitterId);
    Task<Board> Update(Board board);
    Task Delete(Guid boardId, Guid sitterId);
    Task<List<Board>> GetFiltered(params IBoardSpecification[] specifications);
    Task<List<Board>> GetAll();
}