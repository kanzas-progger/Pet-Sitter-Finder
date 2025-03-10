using Boards.Core.Models;

namespace Boards.Core.Specifications;

public class BoardPriceSpecification : IBoardSpecification
{
    private readonly decimal _maxPrice;
    public decimal MaxPrice => _maxPrice;

    public BoardPriceSpecification(decimal maxPrice)
    {
        _maxPrice = maxPrice;
    }

    public bool IsSatisfiedBy(Board board)
    {
        return board.Price <= _maxPrice;
    }
}