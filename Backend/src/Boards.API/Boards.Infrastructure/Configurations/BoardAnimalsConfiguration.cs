using Boards.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Boards.Infrastructure.Configurations;

public class BoardAnimalsConfiguration : IEntityTypeConfiguration<BoardAnimalsEntity>
{
    public void Configure(EntityTypeBuilder<BoardAnimalsEntity> builder)
    {
        builder.HasKey(b => new {b.BoardId, b.AnimalId});
        
        builder.HasOne(b => b.Board).WithMany(b => b.BoardAnimals).HasForeignKey(b => b.BoardId);
    }
}