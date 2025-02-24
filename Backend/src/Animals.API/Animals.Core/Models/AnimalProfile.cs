namespace Animals.Core.Models;

public class AnimalProfile
{
    public const int MAX_DESCRIPTION_LENGTH = 500;
    public const int MAX_TYPE_LENGTH = 50;
    public const int MAX_NAME_LENGTH = 30;
    public const int MAX_GENDER_LENGTH = 10;
    
    public Guid Id { get; }
    public int AnimalId { get; }
    public Guid OwnerId { get; }
    public string Name { get; } = String.Empty;
    public DateTime Birthday { get; } = DateTime.UtcNow;
    public string Gender { get; } = String.Empty;
    public string Type { get; } = String.Empty;
    public int Count { get; } = 1;
    public string Description { get; } = String.Empty;
    public string ProfileImage { get; } = String.Empty;

    private AnimalProfile(Guid id, int animalId, Guid ownerId, string name, DateTime birthday,
        string gender, string type, int count, string description, string profileImage)
    {
        Id = id;
        AnimalId = animalId;
        OwnerId = ownerId;
        Name = name;
        Birthday = birthday;
        Gender = gender;
        Type = type;
        Count = count;
        Description = description;
        ProfileImage = profileImage;
    }

    public static (AnimalProfile animalProfile, string error) Create(Guid id, int animalId, Guid ownerId,
        string name, DateTime birthday, string gender, string type, int count,
        string description, string profileImage)
    {
        string error = String.Empty;
        if (name.Length > MAX_NAME_LENGTH)
            error += $"Name length must be less than {MAX_NAME_LENGTH}";
        if (gender.Length > MAX_GENDER_LENGTH)
            error += $"Gender length must be less than {MAX_GENDER_LENGTH}";
        if (type.Length > MAX_TYPE_LENGTH)
            error += $"Type length must be less than {MAX_TYPE_LENGTH}";
        if (description.Length > MAX_DESCRIPTION_LENGTH)
            error += $"Description length must be less than {MAX_DESCRIPTION_LENGTH}";

        var newAnimalProfile = new AnimalProfile(id, animalId, ownerId, name, birthday, gender, 
            type, count, description, profileImage);
        
        return (newAnimalProfile, error);
    }
}