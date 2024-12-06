namespace UserProfiles.Core.Models;

public class OwnerProfile
{
    public const int MAX_ABOUT_LENGTH = 2500;
    public const int MAX_PHONE_NUMBER_LENGHT = 18;   
    public const int MIN_PHONE_NUMBER_LENGHT = 12;   // sybmols '+7' and min 10 numbers
    
    public Guid Id { get; }
    public Guid OwnerId { get; }
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

    private OwnerProfile(Guid id, Guid ownerId, string login, string firstname, string lastname, string fathername, int age,
        string email, string phoneNumber, string profileImagePath, string country, string city, string address,
        string about)
    {
        Id = id;
        OwnerId = ownerId;
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

    public static (OwnerProfile ownerProfile, string error) Create(Guid id, Guid ownerId, string login,
        string firstname, string lastname, string fathername, int age,
        string email, string phoneNumber, string profileImagePath, string country,
        string city, string address, string about)
    {
        string error = string.Empty;
        if (phoneNumber.Length < MIN_PHONE_NUMBER_LENGHT && !string.IsNullOrEmpty(phoneNumber))
            error += $"Minimal phone number lenght is {MIN_PHONE_NUMBER_LENGHT}";
        if (phoneNumber.Length > MAX_PHONE_NUMBER_LENGHT)
            error += $"Max phone number length if {MAX_PHONE_NUMBER_LENGHT}";
        
        if (about.Length > MAX_ABOUT_LENGTH)
            error += $"Max about length if {MAX_ABOUT_LENGTH}";

        OwnerProfile ownerProfile = new OwnerProfile(id, ownerId, login, firstname, lastname, fathername,
            age, email, phoneNumber, profileImagePath, country, city, address, about);
        
        return (ownerProfile, error);
    }
}