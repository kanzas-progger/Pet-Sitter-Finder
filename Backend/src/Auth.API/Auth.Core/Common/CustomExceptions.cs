namespace Auth.Core.Common;

public class CustomExceptions
{
    public abstract class DomainException : Exception
    {
        protected DomainException(string message) : base(message) { }
    }

    public class UserNotFoundException : DomainException
    {
        public UserNotFoundException() : base("User not found") { }
    }
    
    public class RoleNotFoundException : DomainException
    {
        public RoleNotFoundException(string role) : base($"Role '{role}' not found.") { }
    }
}