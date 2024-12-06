using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserProfiles.Core.Models;
using UserProfiles.Infrastructure.Entities;

namespace UserProfiles.Infrastructure.Configurations;

public class OwnerProfileConfiguration : IEntityTypeConfiguration<OwnerProfileEntity>
{
    public void Configure(EntityTypeBuilder<OwnerProfileEntity> builder)
    {
        builder.HasKey(o => o.Id);
        
        builder.Property(o => o.OwnerId).IsRequired();
        builder.Property(o => o.Login).IsRequired();
        builder.Property(o => o.Firstname).IsRequired();
        builder.Property(o => o.Lastname).IsRequired();
        builder.Property(o => o.Age).IsRequired();
        builder.Property(o => o.Fathername).IsRequired(false);
        builder.Property(o => o.Email).IsRequired(false);
        builder.Property(o => o.PhoneNumber).IsRequired(false)
            .HasMaxLength(OwnerProfile.MAX_PHONE_NUMBER_LENGHT);
        builder.Property(o => o.ProfileImagePath).IsRequired(false);
        builder.Property(o => o.Country).IsRequired(false);
        builder.Property(o => o.City).IsRequired(false);
        builder.Property(o => o.Address).IsRequired(false);
        builder.Property(o => o.About).IsRequired(false)
            .HasMaxLength(OwnerProfile.MAX_ABOUT_LENGTH);

        builder.HasMany(o => o.ProfilePhotos).WithOne(p => p.OwnerProfile)
            .HasForeignKey(p => p.OwnerProfileId);
    }
}