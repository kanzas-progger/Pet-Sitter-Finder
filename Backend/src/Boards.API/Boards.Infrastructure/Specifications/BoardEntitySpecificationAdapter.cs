using System.Linq.Expressions;
using Boards.Core.Specifications;
using Boards.Infrastructure.Entities;

namespace Boards.Infrastructure.Specifications;

public abstract class BoardEntitySpecificationAdapter<T> : Specification<BoardEntity> 
    where T : IBoardSpecification
{
    protected readonly T Specification;

    protected BoardEntitySpecificationAdapter(T specification, 
        Expression<Func<BoardEntity, bool>> expression) 
        : base(expression)
    {
        Specification = specification;
    }
}