using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Requests.Infrastructure.Entities;

namespace Requests.Infrastructure.Configurations;

public class RequestAnimalsConfiguration : IEntityTypeConfiguration<RequestAnimalsEntity>
{
    public void Configure(EntityTypeBuilder<RequestAnimalsEntity> builder)
    {
        builder.HasKey(ra => new {ra.RequestId, ra.AnimalId});
        
        builder.Property(ra => ra.AnimalId).IsRequired();
        builder.Property(ra => ra.Count).IsRequired();
        builder.Property(ra => ra.AnimalProfileId).IsRequired(false);
        
        builder.HasOne(ra => ra.Request)
            .WithMany(r => r.RequestAnimals)
            .HasForeignKey(ra => ra.RequestId);
    }
}