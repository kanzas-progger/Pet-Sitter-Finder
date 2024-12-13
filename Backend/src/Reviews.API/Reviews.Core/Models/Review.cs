namespace Reviews.Core.Models;

public class Review
{
    public const int MAX_STARS_VALUE = 5;
    public const int MIN_STARS_VALUE = 1;
    public const int MAX_CONTENT_LENGHT = 500;
    public const int MIN_CONTENT_LENGHT = 20;
    public const int EXPIRATION_DAYS_TO_UPDATE = 1;
    
    public Guid Id { get; }
    public Guid SitterId { get; }
    public Guid SenderId { get; }
    public int Stars { get; } = 0;
    public string Content { get; }
    public DateTime CreationDate { get; }
    public DateTime ExpirationToUpdateAndDelete { get; }

    private Review(Guid id, Guid sitterId, Guid senderId, int stars, string content, 
        DateTime creationDate, DateTime expirationToUpdateAndDelete)
    {
        Id = id;
        SitterId = sitterId;
        SenderId = senderId;
        Stars = stars;
        Content = content;
        CreationDate = creationDate;
        ExpirationToUpdateAndDelete = expirationToUpdateAndDelete;
    }

    public static (Review review, string error) Create(Guid id, Guid sitterId, Guid senderId,
        int stars, string content, DateTime creationDate, DateTime expirationToUpdateAndDelete)
    {
        string error = string.Empty;
        
        if (content.Length < MIN_CONTENT_LENGHT)
            error += $"Content length must be at least {MIN_CONTENT_LENGHT} symbols";
        if (content.Length > MAX_CONTENT_LENGHT)
            error += $"Content max length must be {MAX_CONTENT_LENGHT} symbols";
        if (stars < MIN_STARS_VALUE)
            error += $"Stars must have minimum value {MIN_STARS_VALUE}";
        if (stars > MAX_STARS_VALUE)
            error += $"Stars must have maximum value {MAX_STARS_VALUE}";
        
        Review newReview = new Review(id, sitterId, senderId, stars, content, creationDate,
            expirationToUpdateAndDelete);
        
        return (newReview, error);
    }
}