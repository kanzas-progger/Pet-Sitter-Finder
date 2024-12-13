namespace UserProfiles.API.Contracts.Responses;

public record SitterFullProfileResponse(Guid profileid, Guid sitterId, string login, string firstname, string lastname,
    string fathername, int age, string email, string phoneNumber, string profileImagePath,
    string country, string city, string address, decimal rating, int rateCount,
    string about, decimal pricePerDay, List<SitterReviewResponse> reviews);