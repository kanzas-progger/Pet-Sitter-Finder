namespace UserProfiles.API.Contracts.Responses;

public record ShortSitterProfileResponse(Guid sitterId, string firstname, string lastname,
    string login, string profileImage);