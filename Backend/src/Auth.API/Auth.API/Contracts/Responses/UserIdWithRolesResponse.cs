namespace Auth.API.Contracts.Responses;

public record UserIdWithRolesResponse(Guid userId, List<string> roles);