using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopingController : ControllerBase
    {
        private readonly MyDbContext _db;
        public ShopingController(MyDbContext db)
        {
            _db = db;
        }

        // return all categories :
        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _db.Categories.ToListAsync();
            return Ok(categories);
        }

        //fetch all books, including their categories and other related data:
        [HttpGet("books")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _db.Books.ToListAsync();
            return Ok(books);
        }


        // return books that belong to a specific category :
        [HttpGet("categories/{categoryId}/books")]
        public async Task<IActionResult> GetBooksByCategory(int categoryId)
        {
            // First check if the category exists to provide a clear error if it doesn't
            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == categoryId);
            if (!categoryExists)
            {
                return NotFound("Category not found.");
            }

            // Now query for books in that category
            var books = await _db.Books
                .Where(b => b.Categories.Any(c => c.Id == categoryId))
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Publisher,
                    b.YearPublished,
                    b.Description,
                    b.Price,
                    b.DiscountPercentage,
                    b.ImageUrl,
                    b.Rating
                })
                .ToListAsync();

            return Ok(books);

            // the output : 
            //List of :
            //{
            //    "id": 11,
            //    "title": "Book Title 11",
            //    "author": "Author 11",
            //    "publisher": "Publisher Name",
            //    "yearPublished": 2020,
            //    "description": "This is a sample description for book 11",
            //    "price": 29.99,
            //    "discountPercentage": 10,
            //    "imageUrl": "https://edit.org/images/cat/book-covers-big-2019101610.jpg",
            //    "rating": 4.5
            //  }
        }


      
    }
}
