using Animals.Core.Abstractions;
using Animals.Infrastructure.Protos;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;

namespace Animals.Infrastructure.GrpcServices;

public class AnimalsGrpcService : AnimalsProtoService.AnimalsProtoServiceBase
{
    private readonly AnimalsDbContext _animalsDbContext;
    private readonly IUserAnimalsRepository _userAnimalsRepository;

    public AnimalsGrpcService(AnimalsDbContext animalsDbContext, 
        IUserAnimalsRepository userAnimalsRepository)
    {
        _animalsDbContext = animalsDbContext;
        _userAnimalsRepository = userAnimalsRepository;
    }
    public override async Task<ListAnimalsResponse> GetAnimalsList(ListAnimalsRequest request,
        ServerCallContext context)
    {
        var animals = await _animalsDbContext.Animals.ToListAsync();

        var response = new ListAnimalsResponse();
        response.Animals.AddRange(animals.Select(a => new Animal {AnimalId = a.Id, Name = a.Name}));
        
        return response;
    }

    public override async Task<ListAnimalsForUserResponse> GetAnimalsListForUser(ListAnimalsForUserRequest request,
        ServerCallContext context)
    {
        var userAnimals = await _userAnimalsRepository.GetUserAnimals(Guid.Parse(request.UserId));
        var response = new ListAnimalsForUserResponse();
        response.AnimalsForUser.AddRange(userAnimals
            .Select(animalName => new AnimalForUser {Name = animalName}));
        
        return response;
    }
}