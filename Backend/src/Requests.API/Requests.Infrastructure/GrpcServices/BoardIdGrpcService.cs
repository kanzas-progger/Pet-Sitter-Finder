using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Requests.Core.Abstractions;
using Requests.Infrastructure.Protos;

namespace Requests.Infrastructure.GrpcServices;

public class BoardIdGrpcService : BoardIdProtoService.BoardIdProtoServiceBase
{
    private readonly IRequestsRepository _requestsRepository;

    public BoardIdGrpcService(IRequestsRepository requestsRepository)
    {
        _requestsRepository = requestsRepository;
    }

    public override async Task<ListBoardIdResponse> GetBusyBoardIds(ListBoardIdRequest request,
        ServerCallContext context)
    {
        var busyBoards = await _requestsRepository
            .GetAllBusyBoards(request.StartDate.ToDateTime(), request.EndDate.ToDateTime());
        
        var response = new ListBoardIdResponse();
        response.BoardIds.AddRange(busyBoards.Select(boardId => new BoardId
        {
            BoardId_ = boardId.ToString()
        }));
        
        return response;
    }
}