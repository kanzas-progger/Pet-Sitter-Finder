namespace SharedLibrary.Redis.DTO_s;

public record ShortSitterProfileDto(Guid sitterId, string firstname, string lastname, string login,
    string profileImage, string country, string city, string address, decimal rating,
    int rateCount);