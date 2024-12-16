namespace UserProfiles.API.Contracts.Responses;

public record SitterProfileResponseForAnnonymous(Guid profileid, Guid sitterId, string login, 
    string firstname, string lastname, string profileImagePath, string country, string city, 
    string address, decimal rating, int rateCount, decimal pricePerDay, List<string> animals);