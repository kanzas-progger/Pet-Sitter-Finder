using Reviews.Core.Models;

namespace Reviews.Core.Abstractions;

public interface IReviewsRepository
{
    Task<List<Review>> GetAll(Guid sitterId);
    Task<Review> GetById(Guid senderId);
    Task<Guid> Create(Review review);
    Task<Guid> Delete(Guid reviewId);
    Task<Guid> Update(Review review);
    Task<bool> Exists(Guid sitterId, Guid senderId);
    Task<(decimal totalRating, int rateCount)> GetTotalRatingAndRateCount(Guid sitterId);
}