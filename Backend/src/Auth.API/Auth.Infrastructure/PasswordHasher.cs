using Auth.Core.Abstractions;

namespace Auth.Infrastructure;

public class PasswordHasher : IPasswordHasher
{
    public string GeneratePasswordHash(string password)
    {
        string passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(password);
        return passwordHash;
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        bool ifVerify = BCrypt.Net.BCrypt.EnhancedVerify(password, passwordHash);
        return ifVerify;
    }
}