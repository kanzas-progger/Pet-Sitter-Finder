using Boards.Infrastructure.Protos;
using Google.Protobuf.WellKnownTypes;

namespace Boards.Infrastructure.GrpcClients;

public class BoardIdsGrpcClient
{
    private readonly BoardIdProtoService.BoardIdProtoServiceClient _client;

    public BoardIdsGrpcClient(BoardIdProtoService.BoardIdProtoServiceClient client)
    {
        _client = client;
    }

    public async Task<ListBoardIdResponse> GetBusyBoardIds(DateTime startDate, DateTime endDate)
    {
        var request = new ListBoardIdRequest
        {
            StartDate = Timestamp.FromDateTime(startDate),
            EndDate = Timestamp.FromDateTime(endDate)
        };
        
        var response = await _client.GetBusyBoardIdsAsync(request);
        
        return response;
    }
}