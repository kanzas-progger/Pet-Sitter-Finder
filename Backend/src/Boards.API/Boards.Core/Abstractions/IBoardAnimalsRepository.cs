namespace Boards.Core.Abstractions;

public interface IBoardAnimalsRepository
{
    Task<List<int>> GetBoardAnimalsForSitter(Guid sitterId);
}