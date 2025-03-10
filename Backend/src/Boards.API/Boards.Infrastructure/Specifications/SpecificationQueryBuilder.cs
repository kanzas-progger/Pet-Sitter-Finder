namespace Boards.Infrastructure.Specifications;

public static class SpecificationQueryBuilder
{
    public static IQueryable<T> GetQuery<T>(IQueryable<T> inputQuery,
        Specification<T> specification)
    {
        var query = inputQuery;
        
        if(specification.Query != null)
            query = query.Where(specification.Query);
        if(specification.Include != null)
            query = specification.Include(query);
        
        return query;
    }

    public static IQueryable<T> GetQuery<T>(IQueryable<T> inputQuery,
        params Specification<T>[] specifications)
    {
        var query = inputQuery;
        foreach (var spec in specifications.Where(s => s != null))
        {
            query = GetQuery(query, spec);
        }
        
        return query;
    }
}