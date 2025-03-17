using Boards.Core.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Boards.Infrastructure.Repositories;

public class BoardAnimalsRepository : IBoardAnimalsRepository
{
    private readonly BoardsDbContext _context;

    public BoardAnimalsRepository(BoardsDbContext context)
    {
        _context = context;
    }

    public async Task<List<int>> GetBoardAnimalsForSitter(Guid sitterId)
    {
        var animalIds = await _context.BoardAnimals
            .Where(ba => ba.Board.SitterId == sitterId)
            .Select(ba => ba.AnimalId)
            .ToListAsync();
        
        return animalIds;
    }
    
    public async Task<List<int>> GetAnimalIdsForBoard(Guid boardId)
    {
        var existingAnimalIds = await _context.BoardAnimals
            .Where(ba => ba.BoardId == boardId)
            .Select(ba => ba.AnimalId)
            .ToListAsync();
        
        return existingAnimalIds;
    }
}