using Requests.Core.DTOs;
using Requests.Core.Enums;
using Requests.Core.Models;

namespace Requests.Core.Abstractions;

public interface IRequestsRepository
{
    Task<Request> Create(Request request);
    Task<bool> IsExisted(Guid boardId, Guid ownerId);
    Task<List<Request>> GetAllForUser(Guid userId);
    Task<List<Guid>> GetAllBusyBoards(DateTime startDate, DateTime endDate);
    Task<List<DateRangeDto>> GetAllDisabledDatesForBoard(Guid boardId);
    Task<Status> UpdateStatus(Guid requestId, Status status);
    Task Delete(Guid requestId);
    Task DeleteAccepted();
}