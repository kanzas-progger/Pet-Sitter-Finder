using Boards.Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Boards.Infrastructure.Specifications;

public class BoardEntityBusySpecification : BoardEntitySpecificationAdapter<BoardBusySpecification>
{
    public BoardEntityBusySpecification(BoardBusySpecification specification)
        : base(specification, b => !specification.BusyBoardIds.Contains(b.Id))
    {
        Include = query => query.Include(b => b.BoardAnimals);
    }
}