using Requests.Core.Models;

namespace Requests.API.Contracts;

public record CreateRequest(Guid boardId, Guid sitterId, List<RequestAnimalRequest> animals,
    decimal totalPrice, DateTime startDate, DateTime endDate, string? ownerMessage);