using Boards.Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Boards.Infrastructure.Specifications;

public class BoardEntityAnimalsSpecification : BoardEntitySpecificationAdapter<BoardAnimalsSpecification>
{
    public BoardEntityAnimalsSpecification(BoardAnimalsSpecification specification) 
        : base(specification, 
            b => b.BoardAnimals.Any(ba => specification.AnimalIds.Contains(ba.AnimalId)))
    {
        Include = query => query.Include(b => b.BoardAnimals);
    }
}