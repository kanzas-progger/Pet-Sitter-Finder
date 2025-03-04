using System.ComponentModel.DataAnnotations.Schema;

namespace Boards.Infrastructure.Entities;

[Table("BoardAnimals")]
public class BoardAnimalsEntity
{
    public Guid BoardId { get; set; }
    public int AnimalId { get; set; }
    
    public BoardEntity Board { get; set; }
}