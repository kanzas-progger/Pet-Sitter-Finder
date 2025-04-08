using Boards.Core.Models;

namespace Boards.Core.Specifications;

public class BoardBusySpecification : IBoardSpecification
{
    private readonly List<Guid> _busyBoardIds;
    public List<Guid> BusyBoardIds => _busyBoardIds;

    public BoardBusySpecification(List<Guid> busyBoardIds)
    {
        _busyBoardIds = busyBoardIds;
    }
    
    public bool IsSatisfiedBy(Board board)
    {
        return !_busyBoardIds.Contains(board.Id);
    }
}