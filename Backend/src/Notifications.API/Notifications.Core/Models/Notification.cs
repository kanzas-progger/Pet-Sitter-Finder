using System.Security.Cryptography.X509Certificates;
using Notifications.Core.Enums;

namespace Notifications.Core.Models;

public class Notification
{
    public const int MAX_HEADER_LENGTH = 80;
    public const int MAX_BODY_LENGTH = 500;
    public const int MIN_HEADER_LENGTH = 5; 
    public Guid Id { get; }
    public Guid SenderId { get; }
    public Guid RecipientId { get; }
    public NotificationType Type { get; }
    public string Header { get; }
    public string? Body { get; }
    public bool IsRead { get; }
    public DateTime CreatedAt { get; }

    public Notification(Guid id, Guid senderId, Guid recipientId, NotificationType type,
        string header, string? body, bool isRead, DateTime createdAt)
    {
        Id = id;
        SenderId = senderId;
        RecipientId = recipientId;
        Type = type;
        Header = header;
        Body = body;
        IsRead = isRead;
        CreatedAt = createdAt;
    }

    public static (Notification newNotification, string error) Create(Guid id, Guid senderId,
        Guid recipientId, NotificationType type, string header, string? body, bool isRead, DateTime createdAt)
    {
        string error = String.Empty;
        if (header.Length > MAX_HEADER_LENGTH)
            error += $"Max header length is {MAX_HEADER_LENGTH}";
        if (header.Length < MIN_HEADER_LENGTH)
            error += $"Min header length is {MIN_HEADER_LENGTH}";
        if (body?.Length > MAX_BODY_LENGTH)
            error += $"Max body length is {MAX_BODY_LENGTH}";
        
        Notification newNotification = new Notification(id, senderId, recipientId, type,
            header, body, isRead, createdAt);
        return (newNotification, error);
    }
}

