using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Favorite;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public FavoriteService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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
        public async Task<bool> AddBeauticianToFavorite(FavoriteRequest request)
        {
            var check = _context.Favorite.Where(x => x.CustomerId == request.CustomerId).FirstOrDefault(x => x.BeauticianId == request.BeauticianId);
            if (check != null)
            {
                throw new Exception("Thợ này đã có trong danh sách");
            }
            var data = new Favorite()
            {
                CustomerId = request.CustomerId,
                BeauticianId = request.BeauticianId,
            };
            _context.Favorite.Add(data);
            return _context.SaveChanges() > 0;

        }

        public List<FavoriteList> GetFavoriteList()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var data = _context.Favorite.Where(x => x.CustomerId == Int32.Parse(claimId.Value));
            var list = new List<FavoriteList>();
            foreach (var item in data)
            {
                list.Add(new FavoriteList
                {
                    ID = item.ID,
                    BeauticianId = item.BeauticianId,
                    CustomerId = item.CustomerId,
                });
            }
            return list;
        }

        public async Task<bool> RemoveBeauticianToFavorite(int BeauticianId, int CustomerId)
        {
            var check = _context.Favorite.Where(x => x.CustomerId == CustomerId).FirstOrDefault(x => x.BeauticianId == BeauticianId);
            if (check == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            else
            {
                _context.RemoveRange(check);
            }
            return _context.SaveChanges() > 0;
        }
    }
}
