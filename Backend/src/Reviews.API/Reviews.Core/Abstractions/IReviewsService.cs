using Reviews.Core.Models;

namespace Reviews.Core.Abstractions;

public interface IReviewsService
{
    Task<List<Review>> GetAllReviewsForSitter(Guid sitterId);
    Task<Review> GetReviewByIdForSender(Guid senderId);
    Task<Guid> Create(Guid sitterId, Guid senderId, int stars, string content);
    Task<Guid> Update(Guid reviewId, Guid senderId, int stars, string content);
    Task<Guid> Delete(Guid reviewId);
    Task<bool> IsReviewExistsForSitter(Guid sitterId, Guid senderId);
    Task UpdateSitterRating(Guid sitterId);
}