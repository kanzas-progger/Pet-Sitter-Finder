namespace UserProfiles.Infrastructure.Entities;

public class SitterProfileEntity
{
    public Guid Id { get; set; }
    public Guid SitterId { get; set; }
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
    public decimal Rating { get; set; } = 0;
    public int RateCount { get; set; } = 0;
    public string About { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; } = 0;
    public ICollection<SitterProfilePhotosEntity> ProfilePhotos { get; set; } = [];
}