using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Reviews.Core.Abstractions;
using Reviews.Core.Models;
using Reviews.Infrastructure.Entities;

namespace Reviews.Infrastructure.Repositories;

public class ReviewsRepository : IReviewsRepository
{
    private readonly ReviewsDbContext _context;

    public ReviewsRepository(ReviewsDbContext context)
    {
        _context = context;
    }

    public async Task<List<Review>> GetAll(Guid sitterId)
    {
        var reviewEntities = await _context.Reviews.AsNoTracking()
            .Where(r => r.SitterId == sitterId).ToListAsync();
        
        var reviews = reviewEntities.Select(r => Review.Create(r.Id, r.SitterId, r.SenderId,
            r.Stars, r.Content, r.CreationDate, r.ExpirationToUpdateAndDelete).review).ToList();
        
        return reviews;
    }

    public async Task<Review> GetById(Guid senderId)
    {
        var reviewEntity = await _context.Reviews.AsNoTracking()
                               .FirstOrDefaultAsync(r => r.SenderId == senderId) ??
                           throw new KeyNotFoundException(); // It needs to be processed

        var review = Review.Create(reviewEntity.Id, reviewEntity.SitterId, reviewEntity.SenderId,
            reviewEntity.Stars, reviewEntity.Content, reviewEntity.CreationDate,
            reviewEntity.ExpirationToUpdateAndDelete).review;

        return review;
    }

    public async Task<Guid> Create(Review review)
    {
        var reviewEntity = new ReviewEntity
        {
            Id = review.Id,
            SitterId = review.SitterId,
            SenderId = review.SenderId,
            Stars = review.Stars,
            Content = review.Content,
            CreationDate = review.CreationDate,
            ExpirationToUpdateAndDelete = review.ExpirationToUpdateAndDelete
        };
        
        await _context.Reviews.AddAsync(reviewEntity);
        await _context.SaveChangesAsync();
        
        return reviewEntity.Id;
    }

    public async Task<Guid> Delete(Guid reviewId)
    {
        await _context.Reviews.Where(r => r.Id == reviewId).ExecuteDeleteAsync();
        return reviewId;
    }

    public async Task<Guid> Update(Review review)
    {
        
        await _context.Reviews.Where(r => r.Id == review.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(r => r.Content, review.Content)
                .SetProperty(r => r.Stars, review.Stars));
        
        return review.Id;
    }

    public async Task<bool> Exists(Guid sitterId, Guid senderId)
    {
        return await _context.Reviews.AnyAsync(r => r.SitterId == sitterId && r.SenderId == senderId);
    }
}