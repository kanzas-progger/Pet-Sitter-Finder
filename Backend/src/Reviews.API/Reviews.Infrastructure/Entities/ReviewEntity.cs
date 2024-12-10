using Reviews.Core.Models;

namespace Reviews.Infrastructure.Entities;

public class ReviewEntity
{
    public Guid Id { get; set; }
    public Guid SitterId { get; set; }
    public Guid SenderId { get; set; }
    public int Stars { get; set; } = 0;
    public string Content { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpirationToUpdateAndDelete { get; set; } = DateTime.UtcNow.AddDays(Review.EXPIRATION_DAYS_TO_UPDATE);
}