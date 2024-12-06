using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserProfiles.Infrastructure.Entities;

namespace UserProfiles.Infrastructure.Configurations;

public class OwnerProfilePhotosConfiguration : IEntityTypeConfiguration<OwnerProfilePhotosEntity>
{
    public void Configure(EntityTypeBuilder<OwnerProfilePhotosEntity> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.OwnerProfileId).IsRequired();
        builder.Property(p => p.OwnerId).IsRequired();
        builder.Property(p => p.PhotoUrl).IsRequired();
    }
}