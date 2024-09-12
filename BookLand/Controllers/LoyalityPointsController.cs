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





    }

}
