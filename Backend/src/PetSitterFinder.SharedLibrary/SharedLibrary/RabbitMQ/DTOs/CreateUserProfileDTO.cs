namespace SharedLibrary.RabbitMQ.DTOs;

public record CreateUserProfileDTO(Guid userId, string login, string firstname, string lastname, int age);