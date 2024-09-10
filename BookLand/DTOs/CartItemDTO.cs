namespace BookLand.DTOs
{
    public class CartDto
    {
        public int Id { get; set; }
        public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
    }

    public class CartItemDto
    {
        
        public int ?BookId { get; set; }
        public int ?Quantity { get; set; }
        public string ?Format { get; set; }
        public decimal ?Price { get; set; }
    }

}
