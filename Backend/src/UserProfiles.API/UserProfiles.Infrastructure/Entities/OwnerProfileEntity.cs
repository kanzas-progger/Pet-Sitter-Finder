namespace UserProfiles.Infrastructure.Entities;

public class OwnerProfileEntity
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string Login { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Fathername { get; set; } = string.Empty;
    public int Age { get; set; } = 0;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string ProfileImagePath { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string About { get; set; } = string.Empty;

    public ICollection<OwnerProfilePhotosEntity> ProfilePhotos { get; set; } = [];
}