using Animals.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Animals.Infrastructure.Configurations;

public class UserAnimalsConfiguration : IEntityTypeConfiguration<UserAnimalsEntity>
{
    public void Configure(EntityTypeBuilder<UserAnimalsEntity> builder)
    {
        builder.HasKey(ua => new {ua.UserId, ua.AnimalId});
        
        builder.HasOne(ua => ua.Animal).WithMany(a => a.UserAnimals)
            .HasForeignKey(ua => ua.AnimalId);
        
        builder.HasIndex(ua => new {ua.UserId, ua.AnimalId}).IsUnique();
    }
}