using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EarnPointsController : ControllerBase
    {

        private readonly MyDbContext _db;

        public EarnPointsController(MyDbContext db)
        {
            _db = db;
        }


        [HttpPut("AddPointToUser/{userId}/{orderId}")]
        public IActionResult AddPointToUser(int userId, int orderId)
        {
            if (userId == 0 || orderId == 0)
            {
                return BadRequest();
            }

            if (userId == null || orderId == null)
            {
                return NotFound();
            }


            // get the amount of books the user bought
            int? totalBooks = 0;
            var userOrder = _db.OrderItems.Where(a => a.OrderId == orderId).ToList();

            foreach (var item in userOrder)
                totalBooks += item.Quantity;


            // convert the amount to points
            var pointsConvarsion = _db.EarningPoints.Select(a => a.BookPurchase).First();
            var pointsEarned = totalBooks * pointsConvarsion;


            // add point to user
            var user = _db.Users.Where(a => a.Id == userId).FirstOrDefault();
            if (user.Points == null)
            {
                user.Points = pointsEarned;
                _db.Users.Update(user);
                _db.SaveChanges();
            }
            else
            {
                user.Points += pointsEarned;
                _db.Users.Update(user);
                _db.SaveChanges();
            }


            var pointsTable = _db.PointsLoyalties.Where(a => a.UserId == userId).FirstOrDefault();

            if (pointsTable != null)
            {
                pointsTable.PointsEarned += pointsEarned;
                _db.PointsLoyalties.Update(pointsTable);
                _db.SaveChanges();
            }
            else
            {
                var firstpoints = new PointsLoyalty
                {
                    UserId = userId,
                    PointsEarned = pointsEarned,
                    PointsRedeemed = 0,
                };
                _db.PointsLoyalties.Add(firstpoints);
                _db.SaveChanges();
            };
            return Ok(pointsEarned);
        }



    }
}
