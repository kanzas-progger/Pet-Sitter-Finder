namespace Reviews.API.Contracts.Requests;

public record UpdateReviewRequest(Guid reviewId, int stars, string content);