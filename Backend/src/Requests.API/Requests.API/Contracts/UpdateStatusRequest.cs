using Requests.Core.Enums;

namespace Requests.API.Contracts;

public record UpdateStatusRequest(Guid requestId);