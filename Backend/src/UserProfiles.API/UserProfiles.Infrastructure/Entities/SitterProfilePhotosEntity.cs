namespace UserProfiles.Infrastructure.Entities;

public class SitterProfilePhotosEntity
{
    public Guid Id { get; set; }
    public Guid SitterProfileId { get; set; } // foreign key to SitterProfileEntity
    public Guid SitterId { get; set; }
    public string PhotoUrl { get; set; }
    public SitterProfileEntity SitterProfile { get; set; }
}