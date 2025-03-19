using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Requests.Infrastructure.Entities;

namespace Requests.Infrastructure.Configurations;

public class RequestEntityConfiguration : IEntityTypeConfiguration<RequestEntity>
{
    public void Configure(EntityTypeBuilder<RequestEntity> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.SitterId).IsRequired();
        builder.Property(r => r.BoardId).IsRequired();
        builder.Property(r => r.OwnerId).IsRequired();
        builder.Property(r => r.TotalPrice).IsRequired();
        builder.Property(r => r.Status).IsRequired();
        builder.Property(r => r.OwnerMessage).IsRequired(false);
        builder.Property(r => r.StartDate).IsRequired();
        builder.Property(r => r.EndDate).IsRequired();
        builder.Property(r => r.CreatedAt).IsRequired();
        
        builder.HasMany(r => r.RequestAnimals)
            .WithOne(ra => ra.Request)
            .HasForeignKey(r => r.RequestId);
    }
}