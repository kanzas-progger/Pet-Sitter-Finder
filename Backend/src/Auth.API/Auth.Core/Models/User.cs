namespace Auth.Core.Models;

public class User
{
    public const int MINIMAL_LOGIN_LENGTH = 5;
    public const int MAXIMAL_LOGIN_LENGTH = 20;
    public const int MINIMAL_FIRSTNAME_LENGTH = 2;
    public const int MINIMAL_LASTNAME_LENGTH = 2;
    
    public Guid Id { get; }
    public string Login { get; } = string.Empty;
    public string PasswordHash { get; } = string.Empty;
    public string Firstname { get; } = string.Empty;
    public string Lastname { get; } = string.Empty;
    public int Age { get; } = 0;
    public DateTime RegistrationDate { get; } = DateTime.UtcNow;

    private User(Guid id, string login, string passwordHash,
        string firstname, string lastname, int age)
    {
        Id = id;
        Login = login;
        PasswordHash = passwordHash;
        Firstname = firstname;
        Lastname = lastname;
        Age = age;
        RegistrationDate =  DateTime.UtcNow;
    }

    public static (User user, string error) Create(Guid id, string login, string passwordHash,
        string firstname, string lastname, int age)
    {
        string error = string.Empty;
        if (login.Length < MINIMAL_LOGIN_LENGTH)
            error += $"Login length must be at least {MINIMAL_LOGIN_LENGTH}";
        if (login.Length > MAXIMAL_LOGIN_LENGTH)
            error += $"Login length must be less than {MAXIMAL_LOGIN_LENGTH}";
        
        User newUser = new User(id, login, passwordHash, firstname, lastname, age);
        
        return (newUser, error);
    }
}