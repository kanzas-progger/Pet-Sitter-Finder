using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserProfiles.Infrastructure.Entities;

namespace UserProfiles.Infrastructure.Configurations;

public class SitterProfilePhotosConfiguration : IEntityTypeConfiguration<SitterProfilePhotosEntity>
{
    public void Configure(EntityTypeBuilder<SitterProfilePhotosEntity> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.SitterProfileId).IsRequired();
        builder.Property(p => p.SitterId).IsRequired();
        builder.Property(p => p.PhotoUrl).IsRequired();
    }
}