using Boards.Core.Specifications;
using Boards.Infrastructure.Entities;

namespace Boards.Infrastructure.Specifications;

public class BoardEntityPriceSpecification : BoardEntitySpecificationAdapter<BoardPriceSpecification>
{
    public BoardEntityPriceSpecification(BoardPriceSpecification specification) 
        : base(specification, b => b.Price <= specification.MaxPrice)
    {
    }
}