namespace Boards.API.Contracts;

public record BoardFilter(decimal? maxPrice, List<string>? animalNames, DateTime? startDate,
    DateTime? endDate);