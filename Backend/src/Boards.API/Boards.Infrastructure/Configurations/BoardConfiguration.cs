using Boards.Core.Models;
using Boards.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Boards.Infrastructure.Configurations;

public class BoardConfiguration : IEntityTypeConfiguration<BoardEntity>
{
    public void Configure(EntityTypeBuilder<BoardEntity> builder)
    {
        builder.HasKey(b => b.Id);
        
        builder.Property(b => b.SitterId).IsRequired();
        builder.Property(b => b.Content).IsRequired().HasMaxLength(Board.MAX_CONTENT_LENGTH);
        builder.Property(b => b.Price).IsRequired();
        builder.Property(b => b.CreatedAt).IsRequired();
        
        builder.HasMany(b => b.BoardAnimals).WithOne(b => b.Board).HasForeignKey(b => b.BoardId);
    }
}