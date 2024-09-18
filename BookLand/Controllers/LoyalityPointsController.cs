using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoyalityPointsController : ControllerBase
    {
        private readonly MyDbContext _db;

        public LoyalityPointsController(MyDbContext dbContext)
        {
            _db = dbContext;
        }

        [HttpGet("userPoints/{userId}")]
        public IActionResult GetUserPoints(int userId)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { UserId = user.Id, Points = user.Points });
        }



        [HttpGet("redeemData")]
        public IActionResult GetRedeemData()
        {
            var redeemData = _db.PointsRedeems.ToList();
            return Ok(redeemData);
        }

        [HttpGet("earningData")]
        public IActionResult GetEarningData()
        {
            var earningData = _db.EarningPoints.ToList();
            return Ok(earningData);
        }


        [HttpPost("useSpinningWheel/{userId}")]
        public IActionResult UseSpinningWheel(int userId)
        {
            // Retrieve the cost per spin from the PointsRedeem table
            var spinningWheelCost = _db.PointsRedeems
                                     .Where(p => p.SpinningWheel.HasValue && p.SpinningWheel.Value > 0)
                                     .Select(p => p.PointsAmount)
                                     .FirstOrDefault();

            if (spinningWheelCost == null)
            {
                return NotFound(new { message = "Spinning wheel cost not configured" });
            }

            // Find the user in the database
            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Check if the user has enough points
            if (user.Points == null || user.Points < spinningWheelCost)
            {
                return BadRequest(new { message = "Not enough points" });
            }

            // Deduct the points
            user.Points -= spinningWheelCost;

            // Save the changes to the database
            _db.SaveChanges();

            return Ok(new { message = "Points deducted successfully", remainingPoints = user.Points, costPerSpin = spinningWheelCost });
        }






    }

}
