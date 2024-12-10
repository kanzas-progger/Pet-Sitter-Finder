namespace Reviews.API.Contracts.Requests;

public record CreateReviewRequest(Guid sitterId, Guid senderId, int stars, string content);