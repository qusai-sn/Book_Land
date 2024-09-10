using BookLand.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BookLand.Controllers
{
    public class GoogleBooksController : Controller
    {
        private readonly MyDbContext _context;
        public GoogleBooksController(MyDbContext context)
        {
            _context = context;
        }
        private async Task<List<Book>> FetchBooksFromGoogleApi(string searchTerm)
        {
            string apiUrl = $"https://www.googleapis.com/books/v1/volumes?q={searchTerm}";

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetStringAsync(apiUrl);
                var jsonResponse = JsonDocument.Parse(response);

                var books = new List<Book>();

                // Parse the response and extract book data
                foreach (var item in jsonResponse.RootElement.GetProperty("items").EnumerateArray())
                {
                    var volumeInfo = item.GetProperty("volumeInfo");

                    var book = new Book
                    {
                        Title = volumeInfo.TryGetProperty("title", out var title) ? title.GetString() : "Unknown Title",
                        Author = volumeInfo.TryGetProperty("authors", out var authors) && authors.GetArrayLength() > 0
                                    ? authors[0].GetString()
                                    : "Unknown Author",
                        Publisher = volumeInfo.TryGetProperty("publisher", out var publisher) ? publisher.GetString() : "Unknown Publisher",
                        YearPublished = volumeInfo.TryGetProperty("publishedDate", out var publishedDate)
                                        ? int.TryParse(publishedDate.GetString().Split('-')[0], out var year) ? year : (int?)null
                                        : (int?)null,
                        Description = volumeInfo.TryGetProperty("description", out var description) ? description.GetString() : "No Description Available",
                        ImageUrl = volumeInfo.TryGetProperty("imageLinks", out var imageLinks) && imageLinks.TryGetProperty("thumbnail", out var thumbnail)
                                    ? thumbnail.GetString()
                                    : null,
                        Price = 0, // Placeholder, as Google Books API doesn't always provide pricing
                        DiscountPercentage = 0,
                        Rating = volumeInfo.TryGetProperty("averageRating", out var rating) ? rating.GetDecimal() : (decimal?)null
                    };

                    books.Add(book);
                }

                return books;
            }
        }

    }
}

