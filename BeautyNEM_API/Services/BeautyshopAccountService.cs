using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.BeautyShop.Account;
using BeautyNEM_API.ViewModels.Jwt;
using Microsoft.EntityFrameworkCore;

namespace BeautyNEM_API.Services
{
    public class BeautyshopAccountService : IBeautyShopAccountService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        public BeautyshopAccountService(BeautyNEMContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AccountLoginVM> Login(AccountLoginRequest request)
        {
            var beautyShop = await _context.BeautyShop.FirstOrDefaultAsync(x => x.Username == request.Username);
            if (beautyShop == null)
                throw new Exception("Tên đăng nhập không tồn tại!");

            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.Password, beautyShop.Password);
            if (!isCorrect)
                throw new Exception("Mật khẩu không hợp lệ!");

            var jwtRequest = new GenerateJwtRequest
            {
                Id = beautyShop.Id,
                FullName = beautyShop.StoreName,
                Username = beautyShop.Username,
            };
            var token = _jwtService.GenerateJwt(jwtRequest);

            return new AccountLoginVM() { id = beautyShop.Id, storeName = beautyShop.StoreName, role = "BeautyShop", jwtToken = token };
        }


        public async Task<int> CreateAccount(ShopAccountRegisterRequest request)
        {
            var checkAccount = await _context.BeautyShop.AnyAsync(x => x.Username == request.Username);
            if (checkAccount)
                throw new Exception("Tên đăng nhập đã tồn tại!");

            var checkPhoneNumber = await _context.BeautyShop.AnyAsync(x => x.PhoneNumber == request.PhoneNumber);
            if (checkPhoneNumber)
                throw new Exception("Số điện thoại đã tồn tại!");

            var city = await _context.City.FirstOrDefaultAsync(x => x.Id == request.CityId);
            if (city == null)
                throw new Exception("Thành phố không hợp lệ!");

            var district = await _context.District.FirstOrDefaultAsync(x => x.Id == request.DistrictId && x.City.Id == city.Id);
            if (district == null)
                throw new Exception("Quận huyện không hợp lệ!");

            if (request.StoreName == null
                || request.Username == null
                || request.Password == null
                || request.PhoneNumber == null
                || request.CityId == 0
                || request.DistrictId == 0)
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var account = new BeautyShop()
            {
                StoreName = request.StoreName,
                Username = request.Username,
                Password = passwordHash,
                PhoneNumber = request.PhoneNumber,
                City = city,
                District = district
            };

            _context.BeautyShop.Add(account);
            await _context.SaveChangesAsync();

            return account.Id;
        }

       
    }
}
