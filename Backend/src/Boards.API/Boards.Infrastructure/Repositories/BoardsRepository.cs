using Boards.Core.Abstractions;
using Boards.Core.Models;
using Boards.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Boards.Infrastructure.Repositories;

public class BoardsRepository : IBoardsRepository
{
    private readonly BoardsDbContext _context;

    public BoardsRepository(BoardsDbContext context)
    {
        _context = context;
    }

    public async Task<Board> Create(Board board)
    {
        var boardEntity = new BoardEntity
        {
            Id = board.Id,
            SitterId = board.SitterId,
            Content = board.Content,
            Price = board.Price,
            CreatedAt = board.CreatedAt
        };

        foreach (var animalId in board.AnimalIds)
        {
            boardEntity.BoardAnimals.Add(new BoardAnimalsEntity
            {
                BoardId = boardEntity.Id,
                AnimalId = animalId,
            });
        }
        
        await _context.Boards.AddAsync(boardEntity);
        await _context.SaveChangesAsync();

        return board;
    }

    public async Task<List<Board>> GetAllForSitter(Guid sitterId)
    {
        var boardEntities = await _context.Boards.AsNoTracking()
            .Include(b => b.BoardAnimals)
            .Where(b => b.SitterId == sitterId)
            .ToListAsync();
        
        var boards = boardEntities.Select(b => Board.Create(
            b.Id, 
            b.SitterId, 
            b.BoardAnimals.Select(a => a.AnimalId).ToList(),
            b.Content,
            b.Price,
            b.CreatedAt).newBoard).ToList();
        
        return boards;
    }

    public async Task<Board> Update(Board board)
    {
        await _context.Boards.Where(b => b.Id == board.Id && b.SitterId == board.SitterId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(b => b.Content, board.Content)
                .SetProperty(b => b.Price, board.Price));
        
        var existingAnimalIds = await _context.BoardAnimals
            .Where(ba => ba.BoardId == board.Id && ba.Board.SitterId == board.SitterId)
            .Select(ba => ba.AnimalId)
            .ToListAsync();
        
        var animalIdsToRemove = existingAnimalIds.Except(board.AnimalIds).ToList();
        var animalIdsToAdd = board.AnimalIds.Except(existingAnimalIds).ToList();

        if (animalIdsToRemove.Any())
        {
            await _context.BoardAnimals
                .Where(ba => ba.BoardId == board.Id && animalIdsToRemove.Contains(ba.AnimalId))
                .ExecuteDeleteAsync();
        }

        if (animalIdsToAdd.Any())
        {
            foreach (var animalId in animalIdsToAdd)
            {
                await _context.BoardAnimals.AddAsync(new BoardAnimalsEntity
                {
                    BoardId = board.Id,
                    AnimalId = animalId
                });
            }
        }
        
        await _context.SaveChangesAsync();
        
        return board;
    }

    public async Task Delete(Guid boardId, Guid sitterId)
    {
        await _context.Boards
            .Where(b => b.Id == boardId && b.SitterId == sitterId)
            .ExecuteDeleteAsync();
    }
}