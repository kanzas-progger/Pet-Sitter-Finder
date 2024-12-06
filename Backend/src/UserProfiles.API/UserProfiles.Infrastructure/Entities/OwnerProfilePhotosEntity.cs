namespace UserProfiles.Infrastructure.Entities;

public class OwnerProfilePhotosEntity
{
    public Guid Id { get; set; }
    public Guid OwnerProfileId { get; set; } //foreign key for OwnerProfileEntity
    public Guid OwnerId { get; set; }
    public string PhotoUrl { get; set; }
    public OwnerProfileEntity OwnerProfile { get; set; }
}