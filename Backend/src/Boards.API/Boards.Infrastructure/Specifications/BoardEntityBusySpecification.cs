using Boards.Core.Specifications;

namespace Boards.Infrastructure.Specifications;

public class BoardEntityBusySpecification : BoardEntitySpecificationAdapter<BoardBusySpecification>
{
    public BoardEntityBusySpecification(BoardBusySpecification specification)
        : base(specification, b => !specification.BusyBoardIds.Contains(b.Id))
    {
        
    }
}