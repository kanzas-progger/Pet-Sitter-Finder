namespace Auth.Core.Abstractions;

public interface IJwtProvider
{
    public string GenerateJwtToken(Guid userId, List<string> roles);
}