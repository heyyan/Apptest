using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Portal.Core.DTOs;
using Portal.Core.Entities;
using Portal.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userRepository.GetUserByEmailAsync(registerDto.Email) != null)
                throw new Exception("User already exists");

            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = _passwordHasher.HashPassword(registerDto.Password)
            };

            await _userRepository.AddUserAsync(user);

            return await GenerateJwtToken(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);
            if (user == null || !_passwordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return await GenerateJwtToken(user);
        }

        private async Task<AuthResponseDto> GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = expires,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt
                }
            };
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }
    }
}
