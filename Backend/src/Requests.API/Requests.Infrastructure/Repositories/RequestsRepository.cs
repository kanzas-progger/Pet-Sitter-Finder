using Microsoft.EntityFrameworkCore;
using Requests.Core.Abstractions;
using Requests.Core.DTOs;
using Requests.Core.Enums;
using Requests.Core.Models;
using Requests.Infrastructure.Entities;

namespace Requests.Infrastructure.Repositories;

public class RequestsRepository : IRequestsRepository
{
    private readonly RequestsDbContext _context;

    public RequestsRepository(RequestsDbContext context)
    {
        _context = context;
    }
    
    public async Task<Request> Create(Request request)
    {
        var requestEntity = new RequestEntity
        {
            Id = request.Id,
            BoardId = request.BoardId,
            SitterId = request.SitterId,
            OwnerId = request.OwnerId,
            TotalPrice = request.TotalPrice,
            Status = request.Status.ToString(),
            OwnerMessage = request.OwnerMessage,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            CreatedAt = request.CreatedAt
        };

        foreach (var animal in request.RequestAnimals)
        {
            requestEntity.RequestAnimals.Add(new RequestAnimalsEntity
            {
                RequestId = requestEntity.Id,
                AnimalId = animal.AnimalId,
                Count = animal.Count,
                AnimalProfileId = animal.AnimalProfileId,
            });
        }
        
        await _context.Requests.AddAsync(requestEntity);
        await _context.SaveChangesAsync();

        return request;
    }

    public async Task<bool> IsExisted(Guid boardId, Guid ownerId)
    {
        return await _context.Requests
            .AnyAsync(r => r.BoardId == boardId && r.OwnerId == ownerId);
    }

    public async Task<List<Request>> GetAllForUser(Guid userId)
    {
        var requestEntities = await _context.Requests.AsNoTracking()
            .Include(r => r.RequestAnimals)
            .Where(r => r.OwnerId == userId || r.SitterId == userId)
            .ToListAsync();

        var requests = requestEntities.Select(r => Request.Create(
            r.Id,
            r.BoardId,
            r.SitterId,
            r.OwnerId,
            r.RequestAnimals.Select(ra => new RequestAnimal
            {
                AnimalId = ra.AnimalId,
                Count = ra.Count,
                AnimalProfileId = ra.AnimalProfileId
            }).ToList(),
            r.TotalPrice,
            (Status)Enum.Parse(typeof(Status),r.Status),
            r.StartDate,
            r.EndDate,
            r.OwnerMessage,
            r.CreatedAt
        ).newRequest).ToList();
        
        return requests;
    }

    public async Task<List<Guid>> GetAllBusyBoards(DateTime startDate, DateTime endDate)
    {
        return await _context.Requests.AsNoTracking()
            .Where(r => r.StartDate.Date <= endDate.Date 
                        && r.EndDate.Date >= startDate.Date 
                        && r.Status == Status.AcceptedAndDatesIsDisabled.ToString())
            .Select(r => r.BoardId)
            .ToListAsync();
    }

    public async Task<List<DateRangeDto>> GetAllDisabledDatesForBoard(Guid boardId)
    {
        return await _context.Requests
            .Where(r => r.BoardId == boardId && r.Status == Status.AcceptedAndDatesIsDisabled.ToString())
            .Select(r => new DateRangeDto(r.StartDate, r.EndDate))
            .ToListAsync();
    }

    public async Task<Status> UpdateStatus(Guid requestId, Status status)
    {
        await _context.Requests.Where(r => r.Id == requestId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(r => r.Status, status.ToString()));
        
        await _context.SaveChangesAsync();
        
        return status;
    }
    
    public async Task Delete(Guid requestId)
    {
        await _context.Requests.Where(r => r.Id == requestId).ExecuteDeleteAsync();
    }

    public async Task DeleteAccepted()
    {
        await _context.Requests
            .Where(r => (r.Status == Status.Accepted.ToString() 
                         || r.Status == Status.AcceptedAndDatesIsDisabled.ToString()) 
                        && r.EndDate.Date >= DateTime.UtcNow.Date)
            .ExecuteDeleteAsync();
    }
}