using UserProfiles.Infrastructure.Protos;

namespace UserProfiles.Infrastructure.GrpcClients;

public class AnimalsGrpcClient
{
    private readonly AnimalsProtoService.AnimalsProtoServiceClient _client;

    public AnimalsGrpcClient(AnimalsProtoService.AnimalsProtoServiceClient client)
    {
        _client = client;
    }

    public async Task<ListAnimalsResponse> GetAnimalsList()
    {
        var request = new ListAnimalsRequest();
        
        var response = await _client.GetAnimalsListAsync(request);
        return response;
    }

    public async Task<ListAnimalsForUserResponse> GetAnimalsListForUser(Guid userId)
    {
        var request = new ListAnimalsForUserRequest { UserId = userId.ToString() };
        var response = await _client.GetAnimalsListForUserAsync(request);
        
        return response;
    }
}