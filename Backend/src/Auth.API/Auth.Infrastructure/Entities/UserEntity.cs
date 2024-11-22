namespace Auth.Infrastructure.Entities;

public class UserEntity
{
    public Guid Id { get; set; }
    public string Login { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public int Age { get; set; } = 0;
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    public ICollection<RoleEntity> Roles { get; set; } = [];
}