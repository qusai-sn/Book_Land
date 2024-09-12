using BookLand.DTOs;
using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookLibraryController : ControllerBase
    {
        private readonly MyDbContext _db;


        public BookLibraryController(MyDbContext db)
        {
            _db = db;
        }



        /// <summary>
        /// ///////////////////////////////////////////
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookLibraryDTO>>> GetBooksInLibrary()
        {
            var booksInLibrary = await _db.Libraries
                .Include(l => l.Book)
                .Select(l => new BookLibraryDTO
                {
                    Id = l.Book.Id,
                    Title = l.Book.Title,
                    Price = l.Book.Price,
                    ImageUrl = l.Book.ImageUrl,
                    Format = l.Format,
                    TotalPrice = l.Book.Price
                })
                .ToListAsync();

            return Ok(booksInLibrary);
        }

        [HttpPost]
        public IActionResult PostLibrary(int UserId, int BookId)
        {

            if (UserId <= 0 || BookId <= 0)
            {

                return BadRequest();

            }

            var postData = new Library
            {
                UserId = UserId,
                BookId = BookId,
                Format = "Hard Copy"
            };
            _db.Libraries.Add(postData);
            _db.SaveChanges();

            return Ok();
        }
    }
}