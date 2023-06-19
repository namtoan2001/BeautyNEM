using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BeautyNEM_API.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;
        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJwt(GenerateJwtRequest request)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[] {
                new Claim(ClaimTypes.Sid, request.Id.ToString()),
                new Claim("userName", request.Username),
                new Claim("fullName", request.FullName)
            };

            var header = new JwtHeader(credentials);
            var payload = new JwtPayload(_config["Jwt:Issuer"], _config["Jwt:Issuer"], claims, null, DateTime.Now.AddDays(1));

            var securityToken = new JwtSecurityToken(header, payload);
            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

            return token;
        }

        public JwtSecurityToken DecodeJwt(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            return jwtSecurityToken;
        }
    }
}
