namespace SharedLibrary.RabbitMQ.DTOs;

public record CreateUserAnimalsDTO(Guid userId, List<int> animalsIds);