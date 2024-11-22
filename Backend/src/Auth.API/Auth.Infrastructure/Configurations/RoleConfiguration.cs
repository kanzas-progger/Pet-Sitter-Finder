using Auth.Core.Enums;
using Auth.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auth.Infrastructure.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
{
    public void Configure(EntityTypeBuilder<RoleEntity> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired();
        
        var roles = Enum.GetValues<Role>()
            .Select(r => new RoleEntity {Id = (int)r, Name = r.ToString()});
        
        builder.HasData(roles);
    }
}