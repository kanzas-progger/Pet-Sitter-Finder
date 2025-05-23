using System.ComponentModel.DataAnnotations;
using Reviews.Core.Abstractions;
using Reviews.Core.Models;
using SharedLibrary.RabbitMQ.DTOs;

namespace Reviews.Application.Services;

public class ReviewsService : IReviewsService
{
    private readonly IReviewsRepository _reviewsRepository;
    private readonly ISitterUpdateRatingPublisher _sitterUpdateRatingPublisher;

    public ReviewsService(IReviewsRepository reviewsRepository,
        ISitterUpdateRatingPublisher sitterUpdateRatingPublisher)
    {
        _reviewsRepository = reviewsRepository;
        _sitterUpdateRatingPublisher = sitterUpdateRatingPublisher;
    }

    public async Task<List<Review>> GetAllReviewsForSitter(Guid sitterId)
    {
        return await _reviewsRepository.GetAll(sitterId);
    }

    public async Task<Review> GetReviewByIdForSender(Guid senderId)
    {
        return await _reviewsRepository.GetById(senderId);
    }

    public async Task<Guid> Create(Guid sitterId, Guid senderId, int stars, string content)
    {
        bool isReviewExists = await _reviewsRepository.Exists(sitterId, senderId);
        if (isReviewExists)
            throw new ValidationException("Review already exists");
        
        var (review, error) = Review.Create(Guid.NewGuid(), sitterId, senderId, stars, content,
            DateTime.UtcNow, DateTime.UtcNow.AddDays(Review.EXPIRATION_DAYS_TO_UPDATE));
        
        if (!string.IsNullOrEmpty(error))
            throw new ValidationException(error);
        
        return await _reviewsRepository.Create(review);
    }

    public async Task<Guid> Update(Guid reviewId, Guid senderId, int stars, string content)
    {
        var existingReview = await _reviewsRepository.GetById(reviewId);
        if (existingReview.SenderId != senderId)
            throw new UnauthorizedAccessException("You are not allowed to edit this review.");
        
        if (existingReview.ExpirationToUpdateAndDelete < DateTime.UtcNow)
            throw new ValidationException("This review can no longer be updated");

        var (review, error) = Review.Create(existingReview.Id, existingReview.SitterId,
            existingReview.SenderId, stars, content, existingReview.CreationDate,
            existingReview.ExpirationToUpdateAndDelete);
        
        if (!string.IsNullOrEmpty(error))
            throw new ValidationException(error);
        
        return await _reviewsRepository.Update(review);
        
    }

    public async Task<Guid> Delete(Guid reviewId)
    {
        // var existingReview = await _reviewsRepository.GetById(reviewId);
        // if (existingReview.ExpirationToUpdateAndDelete < DateTime.UtcNow)
        //     throw new ValidationException("This review can no longer be deleted");
        
        return await _reviewsRepository.Delete(reviewId);
    }

    public async Task<bool> IsReviewExistsForSitter(Guid sitterId, Guid senderId)
    {
        return await _reviewsRepository.Exists(sitterId, senderId);
    }

    public async Task UpdateSitterRating(Guid sitterId)
    {
        var (rating, rateCount) = await _reviewsRepository.GetTotalRatingAndRateCount(sitterId);
        UpdateSitterRatingDTO updateSitterRatingDto = new UpdateSitterRatingDTO(sitterId, rating, rateCount);
        await _sitterUpdateRatingPublisher.SendMessage(updateSitterRatingDto);
    }
    
    
}