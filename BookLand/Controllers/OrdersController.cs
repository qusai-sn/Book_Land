using BookLand.DTOs;
using BookLand.Models;
using BookLand;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;
using System.Net;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class OrdersController : ControllerBase
    {
        private readonly MyDbContext _db;

        private readonly TokenGenerator _tokenGenerator;

        public OrdersController(MyDbContext db, TokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;
        }



        [HttpPost("MoveItemsToOrder/{userId}")]
        public IActionResult MoveItemsToOrder(List<OrderItemsDTO> order, int userId)
        {
            // check if cart items are empty
            if (order == null || order.Count == 0)
            {
                return BadRequest("The order is empty");
            }


            // find total
            decimal? total = 0;
            foreach (var Item in order)
            {
                total += Item.Price;
            }


            // add new order
            var newOrder = new Order
            {
                UserId = userId,
                TotalAmount = total,
                Status = "Pending",
            };
            _db.Orders.Add(newOrder);
            _db.SaveChanges();

            // change  TransactionId to have the new order id
            newOrder.TransactionId = "TXN10" + newOrder.Id;
            _db.SaveChanges();

            // add order items
            foreach (var Item in order)
            {
                var newItem = new OrderItem
                {
                    OrderId = newOrder.Id,
                    BookId = Item.BookId,
                    Quantity = Item.Quantity,
                    Price = Item.Price,
                    Format = Item.Format,
                };
                _db.OrderItems.Add(newItem);
            }
            _db.SaveChanges();


            return Ok();
        }





    }
}
