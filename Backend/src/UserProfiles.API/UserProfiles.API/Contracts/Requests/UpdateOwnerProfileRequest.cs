namespace UserProfiles.API.Contracts.Requests;

public record UpdateOwnerProfileRequest(string firstname, string lastname, string fathername,
    string email, string phoneNumber, string country, string city,
    string address, string about);