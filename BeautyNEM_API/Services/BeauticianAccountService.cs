using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Account;
using BeautyNEM_API.ViewModels.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BeautyNEM_API.Services
{
    public class BeauticianAccountService : IBeauticianAccountService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        public BeauticianAccountService(BeautyNEMContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AccountLoginVM> Login(AccountLoginRequest request)
        {
            var beautician = await _context.Beautician.FirstOrDefaultAsync(x => x.Username == request.Username);
            if (beautician == null)
                throw new Exception("Tên đăng nhập không tồn tại!");

            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.Password, beautician.Password);
            if (!isCorrect)
                throw new Exception("Mật khẩu không hợp lệ!");

            var jwtRequest = new GenerateJwtRequest
            {
                Id = beautician.Id,
                FullName = beautician.FullName,
                Username = beautician.Username,
            };
            var token = _jwtService.GenerateJwt(jwtRequest);

            return new AccountLoginVM() { id = beautician.Id, fullName = beautician.FullName, role = "Beautician", jwtToken = token };
        }

        public async Task<int> CreateAccount(AccountRegisterRequest request)
        {
            var checkAccount = await _context.Beautician.AnyAsync(x => x.Username == request.Username);
            if (checkAccount)
                throw new Exception("Tên đăng nhập đã tồn tại!");

            var checkPhoneNumber = await _context.Beautician.AnyAsync(x => x.PhoneNumber == request.PhoneNumber);
            if (checkPhoneNumber)
                throw new Exception("Số điện thoại đã tồn tại!");

            var city = await _context.City.FirstOrDefaultAsync(x => x.Id == request.CityId);
            if (city == null)
                throw new Exception("Thành phố không hợp lệ!");

            var district = await _context.District.FirstOrDefaultAsync(x => x.Id == request.DistrictId && x.City.Id == city.Id);
            if (district == null)
                throw new Exception("Quận huyện không hợp lệ!");

            if (request.FullName == null
                || request.Username == null
                || request.Password == null
                || request.PhoneNumber == null
                || request.BirthDate == null
                || request.CityId == 0
                || request.DistrictId == 0)
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
            var account = new Beautician()
            {
                FullName = request.FullName,
                Username = request.Username,
                Password = passwordHash,
                PhoneNumber = request.PhoneNumber,
                BirthDate = birthDate,
                City = city,
                District = district
            };

            _context.Beautician.Add(account);
            await _context.SaveChangesAsync();

            if (account.Id > 0)
            {
                var skills = new List<Skill>();
                var listIds = request.ServiceIds.Split(";").ToList();
                if (listIds.Count > 0)
                {
                    foreach (var serviceId in listIds)
                    {
                        if (_context.Service.Any(x => x.Id == Int32.Parse(serviceId)))
                        {
                            skills.Add(new Skill()
                            {
                                Beautician = account,
                                Service = _context.Service.FirstOrDefault(x => x.Id == Int32.Parse(serviceId))
                            });
                        }
                    }
                    _context.Skill.AddRange(skills);
                    _context.SaveChanges();
                }
            }
            return account.Id;
        }

        public List<ServiceVM> GetServices()
        {
            var services = _context.Service.OrderBy(x => x.Id).ToList().Select(x => new ServiceVM()
            {
                id = x.Id,
                item = x.Name
            }).ToList();
            return services;
        }

        public List<CityVM> GetCities()
        {
            var cities = _context.City.OrderBy(x => x.Id).ToList().Select(x => new CityVM()
            {
                id = x.Id,
                item = x.Name

            }).ToList();
            return cities;
        }

        public List<DistrictVM> GetDistricts(int CityID)
        {
            var districts = _context.District
                .OrderBy(x => x.City)
                .Where(x => x.City.Id == CityID)
                .ToList()
                .DistinctBy(t => t.Id);

            if (districts == null)
                throw new Exception($"Cannot find districts  with CityID {CityID}");

            var districtsList = new List<DistrictVM>();
            foreach (var district in districts)
            {
                districtsList.Add(new DistrictVM
                {
                    id = district.Id,
                    item = district.Name,
                });
            }
            return districtsList;
        }
    }
}