using Requests.Core.Abstractions;
using Requests.Core.Enums;
using Requests.Core.Models;
using Requests.Infrastructure.Repositories;

namespace Requests.Application.Services;

public class RequestsService : IRequestsService
{
    private readonly IRequestsRepository _requestsRepository;

    public RequestsService(IRequestsRepository requestsRepository)
    {
        _requestsRepository = requestsRepository;
    }

    public async Task<Request> Create(Request request)
    {
        return await _requestsRepository.Create(request);
    }

    public async Task<List<Request>> GetAllForUser(Guid userId)
    {
        return await _requestsRepository.GetAllForUser(userId);
    }

    public async Task<List<Guid>> GetAllBusyBoards(DateTime startDate, DateTime endDate)
    {
        return await _requestsRepository.GetAllBusyBoards(startDate, endDate);
    }

    public async Task<Status> UpdateStatus(Guid requestId, Status status)
    {
        return await _requestsRepository.UpdateStatus(requestId, status);
    }
    
    public async Task<bool> IsRequestExisted(Guid boardId, Guid ownerId)
    {
        return await _requestsRepository.IsExisted(boardId, ownerId);
    }
    
    public async Task Delete(Guid requestId)
    {
        await _requestsRepository.Delete(requestId);
    }
}