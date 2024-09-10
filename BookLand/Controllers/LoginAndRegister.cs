using BookLand.DTOs;
using BookLand.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;

namespace BookLand.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class LoginAndRegister : ControllerBase
    {

        private readonly MyDbContext _db;

        private readonly TokenGenerator _tokenGenerator;

        private static readonly ConcurrentDictionary<string, (string Email, string Otp, DateTime ExpiryTime)> otpStore = new();

        private readonly IEmailService _emailService;


        public LoginAndRegister(MyDbContext db, TokenGenerator tokenGenerator, IEmailService emailService)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;
            _emailService = emailService;
        }




        [HttpPost("register")]
        public IActionResult Register([FromForm] UsersDTO model)
        {

            var existingUser = _db.Users.FirstOrDefault(u => u.Email == model.Email);

            if (existingUser != null)
                return BadRequest("The user already exists.");


            byte[] passwordHash, passwordSalt;

            PasswordHasher.CreatePasswordHash(model.Password, out passwordHash, out passwordSalt);

            var user = new User
            {
                Name = model.Name,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Email = model.Email,
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok(user);



        }




        [HttpPost("login")]
        public IActionResult Login([FromForm] LoginDTO model)
        {
            var newUser = _db.Users.FirstOrDefault(x => x.Email == model.Email);

            var token = _tokenGenerator.GenerateToken(newUser.Name);

            if (!PasswordHasher.VerifyPasswordHash(model.Password, newUser.PasswordHash, newUser.PasswordSalt))
            {
                return Unauthorized("Invalid username or password.");
            }
            else if (newUser == null)
            {
                return BadRequest("user doesn't exist. please sign up.");
            }
            else
            {
                return Ok(new { Token = token, newUser.Id });
            }
        }



        [HttpPost("GoogleLogin")]
        public IActionResult GoogleLogin(GoogleLoginDTO g)
        {
            // Check if Google email is used before
            var user = _db.Users.FirstOrDefault(a => a.Email == g.Email);

            // If yes, just login
            if (user != null)
            {
                var token = _tokenGenerator.GenerateToken(user.Name);
                return Ok(token);
            }
            else
            {
                // If no, add the user to the table and then login
                var googleUser = new User
                {
                    Name = g.Name,
                    Email = g.Email,
                    Image = g.Image,
                };
                _db.Users.Add(googleUser);
                _db.SaveChanges();

                var token = _tokenGenerator.GenerateToken(g.Name);
                return Ok(new { Gtoken = token });
            }
        }



        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////


        [HttpPost("reset/request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto request)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return BadRequest("User not found");

            // Generate a 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Set the OTP expiration time (e.g., 5 minutes)
            var expiryTime = DateTime.UtcNow.AddMinutes(5);

            // Store the OTP and its expiration in the in-memory store
            otpStore[otp] = (user.Email, otp, expiryTime);  // OTP as key, email and expiry as value

            // Send the OTP to the user's email
            await _emailService.SendEmailAsync(user.Email, "Password Reset OTP", $"Your OTP is {otp}. It will expire in 5 minutes.");

            return Ok("OTP sent to your email.");
        }




        [HttpPost("reset/validate-otp")]
        public IActionResult ValidateOtp([FromBody] OtpValidationDto request)
        {
            // Check if the OTP exists and is valid
            if (!otpStore.TryGetValue(request.Otp, out var otpInfo))
            {
                return BadRequest("Invalid OTP.");
            }

            // Check if the OTP has expired
            if (DateTime.UtcNow > otpInfo.ExpiryTime)
            {
                otpStore.Remove(request.Otp, out _);  // Remove expired OTP
                return BadRequest("OTP has expired.");
            }

            // OTP is valid, return the associated email (or proceed further as needed)
            return Ok(new { Message = "OTP is valid", Email = otpInfo.Email });
        }




        [HttpPut("reset/password/{otp}")]
        public IActionResult ResetPassword([FromBody] PasswordResetDto request, string otp)
        {
            // Retrieve the email from the OTP
            if (!otpStore.TryGetValue(otp, out var otpInfo))
                return BadRequest("Invalid or expired OTP.");

            var user = _db.Users.SingleOrDefault(u => u.Email == otpInfo.Email);
            if (user == null)
                return BadRequest("User not found");

            // Create a new password hash and salt
            byte[] passwordHash, passwordSalt;
            PasswordHasher.CreatePasswordHash(request.NewPassword, out passwordHash, out passwordSalt);

            // Update the user's password hash and salt
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _db.SaveChanges();

            // Optionally remove the OTP after successful password reset
            otpStore.Remove(otp, out _);

            return Ok("Password reset successful.");
        }












    }
}
