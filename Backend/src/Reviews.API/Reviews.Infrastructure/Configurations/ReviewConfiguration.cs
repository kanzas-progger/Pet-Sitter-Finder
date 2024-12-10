using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reviews.Core.Models;
using Reviews.Infrastructure.Entities;

namespace Reviews.Infrastructure.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<ReviewEntity>
{
    public void Configure(EntityTypeBuilder<ReviewEntity> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.SitterId).IsRequired();
        builder.Property(r => r.SenderId).IsRequired();
        builder.Property(r => r.Stars).IsRequired();
        builder.Property(r => r.Content).IsRequired().HasMaxLength(Review.MAX_CONTENT_LENGHT);
        builder.Property(r => r.CreationDate).IsRequired();
        builder.Property(r => r.ExpirationToUpdateAndDelete).IsRequired();
    }
}