using Grpc.Net.Client;
using UserProfiles.Infrastructure.Protos;

namespace UserProfiles.Infrastructure.GrpcClients;

public class ReviewsGrpcClient
{
    private readonly ReviewsProtoService.ReviewsProtoServiceClient _client;

    public ReviewsGrpcClient(ReviewsProtoService.ReviewsProtoServiceClient client)
    {
        _client = client;
    }
    
    public async Task<SitterReviewsResponse> GetReviews(Guid sitterId)
    {
        var request = new SitterReviewsRequest { SitterId = sitterId.ToString() };
        var response = await _client.GetReviewsForSitterAsync(request);
        
        return response;
    }
}