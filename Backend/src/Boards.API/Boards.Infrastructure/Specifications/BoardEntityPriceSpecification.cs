using Boards.Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Boards.Infrastructure.Specifications;

public class BoardEntityPriceSpecification : BoardEntitySpecificationAdapter<BoardPriceSpecification>
{
    public BoardEntityPriceSpecification(BoardPriceSpecification specification) 
        : base(specification, b => b.Price <= specification.MaxPrice)
    {
        Include = query => query.Include(b => b.BoardAnimals);
    }
}