namespace UserProfiles.Core.Models;

public class SitterProfile
{
    public Guid Id { get; }
    public string Login { get; } = string.Empty;
    public string Firstname { get; } = string.Empty;
    public string Lastname { get; } = string.Empty;
    public string Fathername { get; } = string.Empty;
    public int Age { get; } = 0;
    public string Email { get; } = string.Empty;
    public string PhoneNumber { get; } = string.Empty;
    public string ProfileImagePath { get; } = string.Empty;
    public string Country { get; } = string.Empty;
    public string City { get; } = string.Empty;
    public string Address { get; } = string.Empty;
    public decimal Rating { get; } = 0;
    public int RateCount { get; } = 0;
    public string About { get; } = string.Empty;
}