namespace Auth.API.Contracts.Requests;

public record LoginUserRequest(string login, string password);