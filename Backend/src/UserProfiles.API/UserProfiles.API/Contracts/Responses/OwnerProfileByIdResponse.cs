namespace UserProfiles.API.Contracts.Responses;

public record OwnerProfileByIdResponse(Guid profileId, string login, string firstname, 
    string lastname, string fathername, int age, string profileImage, string email, string phoneNumber,
    string country, string city, string address, string about, List<string> profilePhotos);