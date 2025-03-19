using Requests.Infrastructure.Protos;

namespace Requests.Infrastructure.GrpcClients;

public class AnimalsGrpcClient
{
    private readonly AnimalsProtoService.AnimalsProtoServiceClient _client;

    public AnimalsGrpcClient(AnimalsProtoService.AnimalsProtoServiceClient client)
    {
        _client = client;
    }

    public async Task<ListAnimalsResponse> GetListAnimals()
    {
        var request = new ListAnimalsRequest();
        
        var response = await _client.GetAnimalsListAsync(request);
        return response;
    }
}