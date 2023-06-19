using BeautyNEM_API.ViewModels.Jwt;
using System.IdentityModel.Tokens.Jwt;

namespace BeautyNEM_API.Interfaces
{
    public interface IJwtService
    {
        public string GenerateJwt(GenerateJwtRequest request);
        public JwtSecurityToken DecodeJwt(string token);
    }
}
