using BookLand.DTOs;
using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly MyDbContext _db;
        public UserProfileController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {

            var users = _db.Users.ToList();
            return Ok(users);
        }


        /// //////////////////////////////////////////////

        [HttpGet("Api/User/{id}")]
        public IActionResult GetUser(int id)
        {

            if (id == 0)
            {
                return BadRequest();
            }
            else
            {
                var userById = _db.Users.Where(x => x.Id == id).FirstOrDefault();
                return Ok(userById);
            }
        }

        /// ///////////////////////////////////////////////
        [HttpPut("{id}")]
        public IActionResult EditUser([FromForm] UserRequestDTOs userRequestDTOs, int id)
        {

            //var UsersImages = Path.Combine(Directory.GetCurrentDirectory(), "UsersImages");

            //if (!Directory.Exists(UsersImages))
            //{
            //    Directory.CreateDirectory(UsersImages);
            //}

            //if (userRequestDTOs.Image != null) { 

            //    var UserImageFile = Path.Combine(UsersImages, userRequestDTOs.Image);

            //    using (var stream = new FileStream(UserImageFile, FileMode.Create)) {


            //        userRequestDTOs.Image.CopyTo(stream);
            //    }

            //}

            var editUserById = _db.Users.Where(u => u.Id == id).FirstOrDefault();

            if (editUserById == null)
            {
                return BadRequest("User not found.");
            }

            editUserById.Name = userRequestDTOs.Name;
            editUserById.Address = userRequestDTOs.Address;
            editUserById.Email = userRequestDTOs.Email;
            editUserById.PhoneNumber = userRequestDTOs.PhoneNumber;

            _db.Update(editUserById);
            _db.SaveChanges();

            return Ok(editUserById);
        }
        ///////////////////////////////////////////////////////////////
        [HttpPost]
        public IActionResult PostContactDetails([FromForm] ContactUsDTO contactUsDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var newContact = new ContactU
            {
                Name = contactUsDto.Name,
                Email = contactUsDto.Email,
                Subject = contactUsDto.Subject,
                Message = contactUsDto.Message,
                //UserId = userId // Associate the contact details with the user
            };

            _db.ContactUs.Add(newContact);
            _db.SaveChanges();

            return Ok("Contact details have been saved.");
        }

        /// /////////////////////////////////////////////////////////////////////
       
        [HttpGet("wishlist/{userId}")]
        public IActionResult GetWishlist(int userId)
        {
            var wishlistItems = _db.Wishlists.Where(w => w.UserId == userId).Include(w => w.Book).ToList();

            if (wishlistItems == null)
            {
                return NotFound();
            }

            return Ok(wishlistItems);
        }

    }
}

