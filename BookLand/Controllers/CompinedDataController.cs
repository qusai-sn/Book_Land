using BookLand.DTOs;
using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompinedDataController : ControllerBase
    {
        private readonly MyDbContext _db;

        public CompinedDataController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("{userId}/fullProfile")]
        public IActionResult GetUserFullProfile(int userId)
        {
            var user = _db.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserFullProfileDto
                {
                    Name = u.Name,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,

                    // Also map from the related UserDetail entity
                    ProfessionalTitle = u.UserDetail.ProfessionalTitle,
                    Languages = u.UserDetail.Languages,
                    Age = u.UserDetail.Age,
                    Description = u.UserDetail.Description,
                    Country = u.UserDetail.Country,
                    City = u.UserDetail.City,
                    Postcode = u.UserDetail.Postcode
                })
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }










        ///////////////////////////////////////
        ///



        [HttpPut("{userId}/fullProfile")]
        public async Task<IActionResult> UpdateUserFullProfile(int userId, [FromBody] UserFullProfileDto updatedProfile)
        {
            var user = await _db.Users
                .Include(u => u.UserDetail) // Include UserDetails relationship
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            // Update user basic information
            user.Name = updatedProfile.Name;
            user.Email = updatedProfile.Email;
            user.PhoneNumber = updatedProfile.PhoneNumber;
            user.Address = updatedProfile.Address;

            // Update user contact details (from UserDetails)
            if (user.UserDetail != null)
            {
                user.UserDetail.ProfessionalTitle = updatedProfile.ProfessionalTitle;
                user.UserDetail.Languages = updatedProfile.Languages;
                user.UserDetail.Age = updatedProfile.Age;
                user.UserDetail.Description = updatedProfile.Description;
                user.UserDetail.Country = updatedProfile.Country;
                user.UserDetail.City = updatedProfile.City;
                user.UserDetail.Postcode = updatedProfile.Postcode;
            }

            // Save changes
            await _db.SaveChangesAsync();

            return NoContent(); // Return 204 to indicate successful update with no content
        }

    }
}
