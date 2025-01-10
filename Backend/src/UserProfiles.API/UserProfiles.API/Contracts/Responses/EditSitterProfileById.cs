namespace UserProfiles.API.Contracts.Responses;

public record EditSitterProfileById(Guid profileid, string login, string firstname, 
    string lastname, string fathername, string email, string phoneNumber, string profileImagePath,
    List<string> profilePhotos, string country, string city, string address, string about, 
    decimal pricePerDay, List<string> animals);