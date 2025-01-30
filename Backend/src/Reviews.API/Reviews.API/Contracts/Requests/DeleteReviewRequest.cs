namespace Reviews.API.Contracts.Requests;

public record DeleteReviewRequest(Guid sitterId, Guid reviewId);