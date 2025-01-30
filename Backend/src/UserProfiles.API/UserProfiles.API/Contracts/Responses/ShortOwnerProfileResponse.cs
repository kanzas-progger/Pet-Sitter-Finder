namespace UserProfiles.API.Contracts.Responses;

public record ShortOwnerProfileResponse(Guid ownerId, string firstname, string lastname,
    string login, string profileImage);