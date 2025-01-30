namespace SharedLibrary.RabbitMQ.DTOs;

public record UpdateSitterRatingDTO(Guid sitterId, decimal rating, int rateCount);