using System.Linq.Expressions;

namespace Boards.Infrastructure.Specifications;

public abstract class Specification<T>
{
    public Expression<Func<T, bool>>? Query { get; }
    public Func<IQueryable<T>, IQueryable<T>>? Include { get; protected set; }
    public Specification(Expression<Func<T, bool>> query)
    {
        Query = query;
    }
}