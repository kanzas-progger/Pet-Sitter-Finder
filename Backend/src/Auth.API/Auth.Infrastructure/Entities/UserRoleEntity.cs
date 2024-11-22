using System.ComponentModel.DataAnnotations.Schema;

namespace Auth.Infrastructure.Entities;
[Table("UserRoles")]
public class UserRoleEntity
{
    public int RoleId { get; set; }
    public Guid UserId { get; set; }
}