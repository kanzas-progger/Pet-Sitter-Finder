namespace Auth.Core.Abstractions;

public interface IUsersService
{
    Task<string> Register(string login, string password, string firstname, 
        string lastname, int age, string role);

    Task<string> Login(string login, string password);
}