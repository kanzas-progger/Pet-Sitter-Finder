using Requests.Core.Enums;
using Requests.Core.Models;

namespace Requests.Core.Abstractions;

public interface IRequestsService
{
    Task<Request> Create(Request request);
    Task<List<Request>> GetAllForUser(Guid userId);
    Task<List<Guid>> GetAllBusyBoards(DateTime startDate, DateTime endDate);
    Task<Status> UpdateStatus(Guid requestId, Status status);
    Task<bool> IsRequestExisted(Guid boardId, Guid ownerId);
    Task Delete(Guid requestId);
}