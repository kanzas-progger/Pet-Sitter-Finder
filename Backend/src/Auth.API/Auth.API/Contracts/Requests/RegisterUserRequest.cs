namespace Auth.API.Contracts.Requests;

public record  RegisterUserRequest(string login, string password, string confirmPassword,
    string firstname, string lastname, int age, List<string> animals, string role);