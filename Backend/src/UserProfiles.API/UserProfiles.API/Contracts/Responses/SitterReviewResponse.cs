namespace UserProfiles.API.Contracts.Responses;

public record SitterReviewResponse(Guid reviewId, Guid sitterId, Guid senderId, int stars,
    string content, DateTime creationDate, DateTime expirationToUpdateAndDelete);