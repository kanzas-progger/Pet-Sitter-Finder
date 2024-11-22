namespace Auth.Core.Abstractions;

public interface IPasswordHasher
{
    string GeneratePasswordHash(string password);
    bool VerifyPassword(string password, string passwordHash);
}