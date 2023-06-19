using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Customer.Account;
using BeautyNEM_API.ViewModels.Jwt;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Globalization;
namespace BeautyNEM_API.Services
{
    public class CustomerAccountService : ICustomerAccountService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CustomerAccountService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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

        public async Task<AccountLoginVM> Login(AccountLoginRequest request)
        {
            var customer = await _context.Customer.FirstOrDefaultAsync(x => x.Username == request.Username);
            if (customer == null)
                throw new Exception("Tên đăng nhập không tồn tại!");

            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.Password, customer.Password);
            if (!isCorrect)
                throw new Exception("Mật khẩu không hợp lệ!");

            var jwtRequest = new GenerateJwtRequest
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Username = customer.Username,
            };
            var token = _jwtService.GenerateJwt(jwtRequest);

            return new AccountLoginVM() { id = customer.Id, fullName = customer.FullName, role = "Customer", jwtToken = token };
        }

        public async Task<int> CreateAccount(CustomerAccountRegisterRequest request)
        {
            var checkAccount = await _context.Customer.FirstOrDefaultAsync(x => x.Username == request.Username);
            if (checkAccount != null)
                throw new Exception("Tên đăng nhập đã tồn tại!");

            if (request.FullName == null
                || request.Username == null
                || request.Password == null
                || request.PhoneNumber == null
                || request.BirthDate == null
                || request.Address == null)
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            DateTime birthDate;

            if (DateTime.TryParseExact(request.BirthDate, new string[] { "d/M/yyyy", "dd/M/yyyy", "d/MM/yyyy", "dd/MM/yyyy" },
            CultureInfo.InvariantCulture, DateTimeStyles.None, out birthDate))
            {
                
            }
            else
            {
                throw new Exception("Invalid birthdate format. Please use d/m/yyyy, dd/m/yyyy, d/mm/yyyy, or dd/mm/yyyy");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var account = new Customer()
            {
                FullName = request.FullName,
                Username = request.Username,
                Password = passwordHash,
                PhoneNumber = request.PhoneNumber,
                BirthDate = birthDate,
                Address = request.Address
            };

            _context.Customer.Add(account);
            await _context.SaveChangesAsync();

            return account.Id;
        }

        public CustomerAccountVM GetCustomerByID(int CustomerID)
        {
            var customer = _context.Customer.FirstOrDefault(x => x.Id == CustomerID);

            if (customer == null)
                throw new Exception($"Cannot find customer with CustomerID {CustomerID}");

            var accountCustomer = new CustomerAccountVM
            {
                ID = customer.Id,
                FullName = customer.FullName,
                Username = customer.Username,
                PhoneNumber = customer.PhoneNumber,
                BirthDate = customer.BirthDate,
                Address = customer.Address
            };
            return accountCustomer;
        }

        public CustomerAccountVM GetCustomerProfile()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var customer = _context.Customer.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (customer == null)
                throw new Exception($"Không tìm thấy tài khoản với ID {Int32.Parse(claimId.Value)}!");
            return new CustomerAccountVM
            {
                ID = customer.Id,
                FullName = customer.FullName,
                Username = customer.Username,
                PhoneNumber = customer.PhoneNumber,
                BirthDate = customer.BirthDate,
                Address = customer.Address
            };
        }

        public async Task<bool> EditCustomerAccount(CustomerAccountEditRequest request)
        {
            var taiKhoan = await _context.Customer.FirstOrDefaultAsync(x => x.Id == Int32.Parse(request.ID));
            if (taiKhoan == null)
                throw new Exception($"Không tìm thấy tài khoản khách hàng với ID {request.ID}!");


            if (request.FullName == null
                || request.Address == null
                || request.PhoneNumber == null
                || request.BirthDate == DateTime.MinValue)
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            taiKhoan.FullName = request.FullName;
            taiKhoan.Address = request.Address;
            taiKhoan.PhoneNumber = request.PhoneNumber;
            taiKhoan.Address = request.Address;
            taiKhoan.BirthDate = request.BirthDate;
            _context.Customer.Update(taiKhoan);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangePassword(CustomerPasswordRequest request)
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var customer = _context.Customer.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (customer == null)
                throw new Exception($"Không tìm thấy tài khoản với ID {Int32.Parse(claimId.Value)}!");
            if (request.matKhauCu == "" || request.matKhauMoi == "")
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");
            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.matKhauCu, customer.Password);
            if (!isCorrect)
                throw new Exception("Mật khẩu cũ không chính xác!");
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.matKhauMoi);
            customer.Password = passwordHash;
            _context.Customer.Update(customer);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
