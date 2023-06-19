using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Token;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class TokenService : ITokenService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public TokenService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
        }
        public JwtSecurityToken GetJwtSecurityToken()
        {
            string authHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Substring("Bearer ".Length).Trim();
            return _jwtService.DecodeJwt(token);
        }

        public async Task<bool> RefreshToken(RefreshTokenRequest request)
        {
            Beautician beautician = null;
            Customer customer = null;
            if (request.Role == "Beautician")
            {
                beautician = _context.Beautician.FirstOrDefault(x => x.Id == request.UserId);
                if(beautician == null)
                    throw new Exception($"Không tìm thấy thợ làm đẹp với ID {beautician.Id}!");
            }
            else if (request.Role == "Customer")
            {
                customer = _context.Customer.FirstOrDefault(x => x.Id == request.UserId);
                if (customer == null)
                    throw new Exception($"Không tìm thấy khách hàng với ID {customer.Id}!");
            }
            else throw new Exception("Vai trò không tồn tại!");

            if (_context.Token.Any(x => request.Role == "Beautician" ? x.Beautician.Id == beautician.Id : x.Customer.Id == customer.Id))
            {
                //Update token
                var token = _context.Token.FirstOrDefault(x => request.Role == "Beautician" ? x.Beautician.Id == beautician.Id : x.Customer.Id == customer.Id);
                token.TokenDevice = request.TokenDevice;
                _context.Token.Update(token);
                return await _context.SaveChangesAsync() > 0;
            }
            else
            {
                //Add new token
                var token = new Token
                {
                    TokenDevice = request.TokenDevice,
                    Beautician = beautician,
                    Customer = customer
                };
                _context.Token.Add(token);
                await _context.SaveChangesAsync();
                return token.Id > 0;
            }
            return false;
        }

        public string GetTokenDevice(TokenVM tokenVM)
        {
            Beautician beautician = null;
            Customer customer = null;
            if (tokenVM.Role == "Beautician")
            {
                beautician = _context.Beautician.FirstOrDefault(x => x.Id == tokenVM.UserId);
                if (beautician == null)
                    throw new Exception($"Không tìm thấy thợ làm đẹp với ID {beautician.Id}!");
            }
            else if (tokenVM.Role == "Customer")
            {
                customer = _context.Customer.FirstOrDefault(x => x.Id == tokenVM.UserId);
                if (customer == null)
                    throw new Exception($"Không tìm thấy khách hàng với ID {customer.Id}!");
            }
            else throw new Exception("Vai trò không tồn tại!");

            var token = _context.Token.FirstOrDefault(x => tokenVM.Role == "Beautician" ? x.Beautician.Id == beautician.Id : x.Customer.Id == customer.Id);
            if(token == null) throw new Exception("Không tìm thấy token!");
            return token.TokenDevice;
        }
    }
}
