namespace Boards.API.Contracts;

public record BoardFilter(decimal? maxPrice, List<int>? animalIds);