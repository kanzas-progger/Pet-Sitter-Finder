using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserProfiles.Core.Models;
using UserProfiles.Infrastructure.Entities;

namespace UserProfiles.Infrastructure.Configurations;

public class SitterProfileConfiguration : IEntityTypeConfiguration<SitterProfileEntity>
{
    public void Configure(EntityTypeBuilder<SitterProfileEntity> builder)
    {
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.SitterId).IsRequired();
        builder.Property(s => s.Login).IsRequired();
        builder.Property(s => s.Firstname).IsRequired();
        builder.Property(s => s.Lastname).IsRequired();
        builder.Property(s => s.Age).IsRequired();
        builder.Property(s => s.Fathername).IsRequired(false);
        builder.Property(s => s.Email).IsRequired(false);
        builder.Property(s => s.PhoneNumber).IsRequired(false)
            .HasMaxLength(SitterProfile.MAX_PHONE_NUMBER_LENGHT);
        builder.Property(s => s.Country).IsRequired(false);
        builder.Property(s => s.City).IsRequired(false);
        builder.Property(s => s.Address).IsRequired(false);
        builder.Property(s => s.ProfileImagePath).IsRequired(false);
        builder.Property(s => s.RateCount).IsRequired().HasDefaultValue(0);
        builder.Property(s => s.Rating).IsRequired().HasDefaultValue(0);
        builder.Property(s => s.PricePerDay).IsRequired().HasDefaultValue(0);
        builder.Property(s => s.About).IsRequired(false)
            .HasMaxLength(SitterProfile.MAX_ABOUT_LENGTH);

        builder.HasMany(s => s.ProfilePhotos).WithOne(p => p.SitterProfile)
            .HasForeignKey(p => p.SitterProfileId);
    }
}