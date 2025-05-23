namespace Boards.Core.Abstractions;

public interface IBoardAnimalsService
{
    Task<List<int>> GetBoardAnimalsForSitter(Guid sitterId);
    Task<List<int>> GetAnimalIdsForBoard(Guid boardId);
}