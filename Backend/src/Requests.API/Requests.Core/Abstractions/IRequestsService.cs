using Requests.Core.DTOs;
using Requests.Core.Enums;
using Requests.Core.Models;

namespace Requests.Core.Abstractions;

public interface IRequestsService
{
    Task<Request> Create(Request request);
    Task<List<Request>> GetAllForUser(Guid userId);
    Task<List<Guid>> GetAllBusyBoards(DateTime startDate, DateTime endDate);
    Task<List<DateRangeDto>> GetAllDisabledDatesForBoard(Guid boardId);
    Task<Status> UpdateStatus(Guid requestId, bool isDatesDisabled);
    Task<bool> IsRequestExisted(Guid boardId, Guid ownerId);
    Task Delete(Guid requestId);
}