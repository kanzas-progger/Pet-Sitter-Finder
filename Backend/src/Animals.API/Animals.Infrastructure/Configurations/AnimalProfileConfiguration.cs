using Animals.Core.Models;
using Animals.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Animals.Infrastructure.Configurations;

public class AnimalProfileConfiguration : IEntityTypeConfiguration<AnimalProfileEntity>
{
    public void Configure(EntityTypeBuilder<AnimalProfileEntity> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.AnimalId).IsRequired();
        builder.Property(a => a.OwnerId).IsRequired();
        builder.Property(a => a.Name).IsRequired().HasMaxLength(AnimalProfile.MAX_NAME_LENGTH);
        builder.Property(a => a.Birthday).IsRequired();
        builder.Property(a => a.Gender).IsRequired().HasMaxLength(AnimalProfile.MAX_GENDER_LENGTH);
        builder.Property(a => a.Type).IsRequired().HasMaxLength(AnimalProfile.MAX_TYPE_LENGTH);
        builder.Property(a => a.Count).IsRequired();
        builder.Property(a => a.Description).HasMaxLength(AnimalProfile.MAX_DESCRIPTION_LENGTH);
        builder.Property(a => a.ProfileImage);
    }
}