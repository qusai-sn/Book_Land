using BookLand.DTOs;


using BookLand.Models;
using iTextSharp.text.pdf;
using iTextSharp.text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

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
        public IActionResult PostLibrary(int UserId, int BookId) {

            if (UserId <= 0 || BookId <= 0) {
               
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
        [HttpGet("pdf")]
        public IActionResult DownloadPdf(int id)
        {
            var order = _db.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            // قم بإنشاء مستند PDF
            using (var memoryStream = new MemoryStream())
            {
                var document = new Document();
                PdfWriter.GetInstance(document, memoryStream);
                document.Open();

                // إضافة البيانات من DTO إلى الـ PDF
                document.Add(new Paragraph($"Name: {order.User.Name}"));
                document.Add(new Paragraph($"Email: {order.User.Email}"));
                document.Add(new Paragraph($"Phone Number: {order.User.PhoneNumber}"));
                document.Add(new Paragraph("Order Items:"));

                foreach (var item in order.OrderItems)
                {
                    document.Add(new Paragraph($"- Book ID: {item.BookId}, Price: {item.Price}, Quantity: {item.Quantity}"));
                }

                document.Close();

                // إعداد ملف PDF للتحميل
                var fileBytes = memoryStream.ToArray();
                var fileName = "order_details.pdf";

                return File(fileBytes, "application/pdf", fileName);
            }



        }


        [HttpGet("Excel/{id}")]

        public IActionResult DownloadExcel(int id)
        {
            var order = _db.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // إنشاء مستند Excel
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Order Details");

                // إضافة بيانات المستخدم
                worksheet.Cells[1, 1].Value = "Name";
                worksheet.Cells[1, 2].Value = order.User.Name;
                worksheet.Cells[2, 1].Value = "Email";
                worksheet.Cells[2, 2].Value = order.User.Email;

                worksheet.Cells[4, 1].Value = "Order Items";
                worksheet.Cells[5, 1].Value = "Book ID";
                worksheet.Cells[5, 2].Value = "Price";
                worksheet.Cells[5, 3].Value = "Quantity";

                // إضافة عناصر الطلب
                int row = 6;
                foreach (var item in order.OrderItems)
                {
                    worksheet.Cells[row, 1].Value = item.BookId;
                    worksheet.Cells[row, 2].Value = item.Price;
                    worksheet.Cells[row, 3].Value = item.Quantity;
                    row++;
                }

                // إعداد ملف Excel للتحميل
                var fileBytes = package.GetAsByteArray();
                var fileName = "order_details.xlsx";

                return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
        }

    }
}