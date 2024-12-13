using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Reviews.Core.Abstractions;
using Reviews.Infrastructure.Protos;

namespace Reviews.Infrastructure.GrpcServices;

public class ReviewsGrpcService : ReviewsProtoService.ReviewsProtoServiceBase
{
    private readonly IReviewsRepository _reviewsRepository;
    
    public ReviewsGrpcService(IReviewsRepository reviewsRepository)
    {
        _reviewsRepository = reviewsRepository;
    }

    public override async Task<SitterReviewsResponse> GetReviewsForSitter(SitterReviewsRequest request,
        ServerCallContext context)
    {
        
        Guid sitterId = Guid.Parse(request.SitterId);
        Console.WriteLine($"Sitter Id: {sitterId}");
        var reviews = await _reviewsRepository.GetAll(sitterId);
        
        var response = new SitterReviewsResponse();
        response.Reviews.AddRange(reviews.Select(r => new Review
        {
            ReviewId = r.Id.ToString(),
            SitterId = r.SitterId.ToString(),
            SenderId = r.SenderId.ToString(),
            Stars = r.Stars,
            Content = r.Content,
            CreationDate = Timestamp.FromDateTime(r.CreationDate),
            ExpirationToUpdateAndDelete = Timestamp.FromDateTime(r.ExpirationToUpdateAndDelete)
        }));
        
        return response;
        
    }
}