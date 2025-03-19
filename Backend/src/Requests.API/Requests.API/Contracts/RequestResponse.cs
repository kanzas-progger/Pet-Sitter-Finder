using Requests.Core.Enums;
using Requests.Core.Models;

namespace Requests.API.Contracts;

public record RequestResponse(Guid requestId, Guid sitterId, Guid ownerId, 
    List<RequestAnimalsResponse> requestAnimals, decimal totalPrice, string status,
    DateTime startDate, DateTime endDate, string? ownerMessage, DateTime createdAt);