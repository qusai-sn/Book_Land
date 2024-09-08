namespace BookLand.DTOs
{
    public class FinalOrderTableDTO
    {
        public decimal? Price { get; set; }

        public BookInfo pi { get; set; }

    }


    public class BookInfo
    {
        public string? Title { get; set; }

        public string? ImageUrl { get; set; }
    }
}
