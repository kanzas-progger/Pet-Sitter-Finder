namespace UserProfiles.Core.Models;

public class OwnerProfile
{
    public const int MAX_ABOUT_LENGTH = 2500;
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
    public string About { get; } = string.Empty;

    private OwnerProfile(Guid id, string login, string firstname, string lastname, string fathername, int age,
        string email, string phoneNumber, string profileImagePath, string country, string city, string address,
        string about)
    {
        Id = id;
        Login = login;
        Firstname = firstname;
        Lastname = lastname;
        Fathername = fathername;
        Age = age;
        Email = email;
        PhoneNumber = phoneNumber;
        ProfileImagePath = profileImagePath;
        Country = country;
        City = city;
        Address = address;
        About = about;
    }
    
    //public static (OwnerProfile ownerProfile, string error) Update()
}