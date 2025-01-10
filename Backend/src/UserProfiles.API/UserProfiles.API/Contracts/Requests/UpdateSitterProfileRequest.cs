namespace UserProfiles.API.Contracts.Requests;

public record UpdateSitterProfileRequest(string firstname, string lastname, string fathername, 
    string email, string phoneNumber, string country, string city, string address, string about, 
    decimal pricePerDay);