using Animals.Core.Enums;
using Animals.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Animals.Infrastructure.Configurations;

public class AnimalConfiguration : IEntityTypeConfiguration<AnimalEntity>
{
    public void Configure(EntityTypeBuilder<AnimalEntity> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Name).IsRequired();
        
        var animals = Enum.GetValues<Animal>()
            .Select(a => new AnimalEntity{Id = (int)a, Name = a.ToString()});
        
        builder.HasData(animals);
    }
}