using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Customer.Rating;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class RatingService : IRatingService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public RatingService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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

        public async Task<int> AddRatingBeautician(AddRatingRequest request)
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var customer = _context.Customer.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {Int32.Parse(claimId.Value)}!");

            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == request.BeauticianId);
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {request.BeauticianId}!");

            var rating = new Rating
            {
                StarNumber = request.StarNumber,
                Comment = request.Comment ?? "",
                Beautician = beautician,
                Customer = customer,
            };

            _context.Rating.Add(rating);
            await _context.SaveChangesAsync();

            if(rating.Id != 0)
            {
                var eventBooking = _context.Event.FirstOrDefault(x => x.Id == request.EventId);
                if (eventBooking == null)
                    throw new Exception($"Không tìm thấy lịch hẹn với ID {request.EventId}!");
                eventBooking.Rating = rating;
                _context.Event.Update(eventBooking);
                await _context.SaveChangesAsync();
            }
            return rating.Id;
        }
    }
}
