﻿using BookLand.DTOs;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? contactId = contactUsDto.Id;

            var newContact = new ContactU
            {
                Name = contactUsDto.Name,
                Email = contactUsDto.Email,
                Subject = contactUsDto.Subject,
                Message = contactUsDto.Message,
                Id = contactId ?? 0 
            };

            _db.ContactUs.Add(newContact);
            _db.SaveChanges();

            return Ok("Contact details have been saved.");
        }

        /// /////////////////////////////////////////////////////////////////////

        //[HttpPost("wishlist")]
        //public IActionResult AddToWishlist([FromForm] Wishlist wishlistItem)
        //{
        //    if (wishlistItem.UserId == null || wishlistItem.BookId == null)
        //    {
        //        return BadRequest("Invalid data.");
        //    }

        //    var existingItem = _db.Wishlists
        //        .FirstOrDefault(w => w.UserId == wishlistItem.UserId && w.BookId == wishlistItem.BookId);

        //    if (existingItem != null)
        //    {
        //        return Conflict("This item is already in your wishlist.");
        //    }

        //    _db.Wishlists.Add(wishlistItem);
        //    _db.SaveChanges();

        //    return Ok("Item added to wishlist.");
        //}

        //////////////////////////////////////////


        [HttpGet("byUserId/{userId}")]
        public IActionResult GetWishlistByUserIdall(int userId)
        {
            var wishlist = _db.Wishlists
                                        .Where(a => a.UserId == userId)
                                        .ToList();

            if (wishlist == null || !wishlist.Any())
            {
                return NotFound();
            }

            return Ok(wishlist);
        }

        //[HttpDelete("remove/{userId}/{bookId}")]
        //public IActionResult RemoveFromWishlist(int userId, int bookId)
        //{
        //    var wishlistItem = _db.Wishlists.FirstOrDefault(w => w.UserId == userId && w.BookId == bookId);

        //    if (wishlistItem == null)
        //    {
        //        return NotFound();
        //    }

        //    _db.Wishlists.Remove(wishlistItem);
        //    _db.SaveChanges();

        //    return Ok(new { message = "Item removed from wishlist" });
        //}

        [HttpGet("wishlist/{userId}")]
        public IActionResult GetWishlistForUser(int userId)
        {
            var wishlistItems = _db.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Book)  // Ensure you have a relationship set to include Book details
                .ToList();

            if (!wishlistItems.Any())
            {
                return NotFound("No items found in the wishlist for the specified user.");
            }

            var result = wishlistItems.Select(w => new
            {
                ProductId = w.Book.Id,
                ProductName = w.Book.Title,
                UnitPrice = w.Book.Price,
                ProductImage = w.Book.ImageUrl  // Assuming you have an ImageUrl field in your Book model
            }).ToList();

            return Ok(result);
        }
    }
}

