using Grpc.Core;
using UserProfiles.Core.Abstractions;
using UserProfiles.Infrastructure.Protos;

namespace UserProfiles.Infrastructure.GrpcServices;

public class SittersGrpcService : SittersProtoService.SittersProtoServiceBase
{
    private readonly ISitterProfilesRepository _repository;

    public SittersGrpcService(ISitterProfilesRepository repository)
    {
        _repository = repository;
    }

    public override async Task<SittersResponse> GetSitters(SittersRequest request,
        ServerCallContext context)
    {
        var sitters = await _repository.GetAll();
        var response = new SittersResponse();
        
        response.Sitters.AddRange(sitters.Select(s => new Sitter
        {
            SitterId = s.SitterId.ToString(),
            Login = s.Login,
            Firstname = s.Firstname,
            Lastname = s.Lastname,
            Country = s.Country,
            City = s.City,
            Address = s.Address,
            ProfileImage = s.ProfileImagePath,
            Rating = (double)s.Rating,
            RateCount = s.RateCount,
        }));
        
        return response;
    }
}