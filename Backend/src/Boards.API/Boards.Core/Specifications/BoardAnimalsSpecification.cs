using Boards.Core.Models;

namespace Boards.Core.Specifications;

public class BoardAnimalsSpecification : IBoardSpecification
{
    private readonly List<int> _animalIds;
    public List<int> AnimalIds => _animalIds;

    public BoardAnimalsSpecification(List<int> animalIds)
    {
        _animalIds = animalIds;
    }

    public bool IsSatisfiedBy(Board board)
    {
        return _animalIds.Any(id => board.AnimalIds.Contains(id));
    }
}