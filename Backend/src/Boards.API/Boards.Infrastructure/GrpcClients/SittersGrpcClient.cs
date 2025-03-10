using Boards.Infrastructure.Protos;

namespace Boards.Infrastructure.GrpcClients;

public class SittersGrpcClient
{
    private readonly SittersProtoService.SittersProtoServiceClient _client;

    public SittersGrpcClient(SittersProtoService.SittersProtoServiceClient client)
    {
        _client = client;
    }

    public async Task<SittersResponse> GetSittersAsync()
    {
        var request = new SittersRequest();
        
        var response = await _client.GetSittersAsync(request);
        
        return response;
    }
}