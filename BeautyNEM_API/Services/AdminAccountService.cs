using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Administrator.Account;
using BeautyNEM_API.ViewModels.Administrator.Service;
using BeautyNEM_API.ViewModels.Administrator.Statistical;
using BeautyNEM_API.ViewModels.Administrator.Title;
using BeautyNEM_API.ViewModels.Jwt;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace BeautyNEM_API.Services
{
    public class AdminAccountService : IAdminAccountService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        public AdminAccountService(BeautyNEMContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<bool> AddService(ServiceRequest request)
        {
            try
            {
                var serviceName = _context.Service.FirstOrDefault(x => x.Name == request.ServiceName);
                if (serviceName != null)
                {
                    throw new Exception("Tên dịch vụ này đã tồn tại!");
                };
                var account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                var cloudinary = new Cloudinary(account);
                var imageName = $"{Path.GetFileNameWithoutExtension(request.IconFile.FileName)}{Path.GetExtension(request.IconFile.FileName)}";
                string img = new String(Path.GetFileNameWithoutExtension(request.IconFile.FileName));
                var imageUrl = $"ServiceIcon/{img}";

                // Save image information to database
                var data = new Service()
                {
                    Name = request.ServiceName,
                    Icon = imageName
                };

                _context.Service.Add(data);
                await _context.SaveChangesAsync();

                // Upload image to Cloudinary
                using var stream = new MemoryStream();
                await request.IconFile.CopyToAsync(stream);
                stream.Position = 0;

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(imageName, stream),
                    PublicId = imageUrl,
                    Overwrite = true
                };

                await cloudinary.UploadAsync(uploadParams);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteService(int id)
        {
            var data = _context.Skill.FirstOrDefault(x => x.ServiceId == id);
            if (data == null)
            {
                var service = _context.Service.FirstOrDefault(x => x.Id == id);
                var imgName = Path.GetFileNameWithoutExtension(service.Icon);
                if (service == null)
                {
                    throw new Exception("Không tìm thấy dịch vụ!");
                }
                _context.RemoveRange(service);
                Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                var cloudinary = new Cloudinary(account);
                cloudinary.Api.Secure = true;
                var link = $"ServiceIcon/{imgName}";
                var deletionParams = new DeletionParams(link)
                {
                    Invalidate = true,
                    Type = "upload",
                    ResourceType = ResourceType.Image
                };
                var deletionResult = cloudinary.Destroy(deletionParams);
            }
            else
            {
                throw new Exception("Dịch vụ đang được sử dụng, không thể xóa!");
            }
            return _context.SaveChanges() > 0;
        }

        public List<BeauticianStatisticals> GetBeauticianStatisticals()
        {
            var data = _context.Beautician.ToList();
            var list = new List<BeauticianStatisticals>();
            foreach (var beautician in data)
            {
                var city = _context.City.FirstOrDefault(x => x.Id == beautician.CityId);
                var district = _context.District.FirstOrDefault(x => x.Id == beautician.DistrictId);
                list.Add(new BeauticianStatisticals
                {
                    Id = beautician.Id,
                    Username = beautician.Username,
                    PhoneNumber = beautician.PhoneNumber,
                    BirthDate = beautician.BirthDate,
                    CityId = beautician.CityId,
                    CityName = city.Name,
                    DistrictId = beautician.DistrictId,
                    DistrictName = district.Name,
                    FullName = beautician.FullName,
                    Avatar = beautician.Avatar,
                });
            }
            return list;
        }

        public List<BeautyShopStatisticals> GetBeautyShopStatisticals()
        {
            var data = _context.BeautyShop.ToList();
            var list = new List<BeautyShopStatisticals>();
            foreach (var item in data)
            {
                var city = _context.City.FirstOrDefault(x => x.Id == item.CityId);
                var district = _context.District.FirstOrDefault(x => x.Id == item.DistrictId);
                list.Add(new BeautyShopStatisticals
                {
                    Id = item.Id,
                    StoreName = item.StoreName,
                    Username = item.Username,
                    PhoneNumber = item.PhoneNumber,
                    CityId = item.CityId,
                    CityName = city.Name,
                    DistrictId = item.DistrictId,
                    DistrictName = district.Name,
                    Avatar = item.Avatar,
                });
            }
            return list;
        }

        public List<CustomerStatisticals> GetCustomerStatisticals()
        {
            var data = _context.Customer.ToList();
            var customerList = new List<CustomerStatisticals>();
            foreach (var item in data)
            {
                customerList.Add(new CustomerStatisticals
                {
                    Id = item.Id,
                    FullName = item.FullName,
                    Username = item.Username,
                    BirthDate = item.BirthDate,
                    Address = item.Address,
                    PhoneNumber = item.PhoneNumber
                });
            }
            return customerList;
        }

        public List<ServiceRequest> GetServiceList()
        {
            var data = _context.Service.ToList();
            var serviceList = new List<ServiceRequest>();
            foreach (var service in data)
            {
                serviceList.Add(new ServiceRequest
                {
                    Id = service.Id,
                    ServiceName = service.Name,
                    Icon = service.Icon,
                });
            }
            return serviceList;
        }

        public async Task<LoginVM> Login(LoginRequest request)
        {
            var admin = await _context.Administrator.FirstOrDefaultAsync(x => x.Username == request.Username);
            if (admin == null)
            {
                throw new Exception("Tên đăng nhập khồng tồn tại!");
            }
            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.Password, admin.Password);
            if (!isCorrect)
            {
                throw new Exception("Mật khẩu không hợp lệ!");
            }
            var jwtRequest = new GenerateJwtRequest
            {
                Id = admin.Id,
                FullName = admin.Fullname,
                Username = admin.Username,
            };
            var token = _jwtService.GenerateJwt(jwtRequest);
            return new LoginVM()
            {
                FullName = admin.Fullname,
                Role = "Admin",
                JwtToken = token,
            };
        }

        public async Task<bool> UpdateService(ServiceRequest request)
        {
            var service = _context.Service.FirstOrDefault(x => x.Id == request.Id);
            var serviceName = _context.Service.FirstOrDefault(x => x.Name == request.ServiceName);
            if (service == null)
            {
                throw new Exception("Không tìm thấy dịch vụ!");
            }
            if (serviceName != null)
            {
                throw new Exception("Tên dịch vụ này đã tồn tại!");
            };
            if (request.ServiceName == null && request.IconFile != null)
            {
                var account = new Account(
                        "dpwifnuax",
                        "817342852663177",
                        "XHilYh4d2vklt733wnKRZxM-mag");

                var cloudinary = new Cloudinary(account);
                var imageName = $"{Path.GetFileNameWithoutExtension(request.IconFile.FileName)}{Path.GetExtension(request.IconFile.FileName)}";
                string img = new String(Path.GetFileNameWithoutExtension(request.IconFile.FileName));
                var imageUrl = $"ServiceIcon/{img}";
                string cc = new string(Path.GetFileNameWithoutExtension(service.Icon));
                string link = $"ServiceIcon/{cc}";
                var deletionParams = new DeletionParams(link)
                {
                    Invalidate = true,
                    Type = "upload",
                    ResourceType = ResourceType.Image
                };
                var deletionResult = cloudinary.Destroy(deletionParams);

                // Save image information to database
                service.Icon = imageName;

                _context.Service.Update(service);
                await _context.SaveChangesAsync();

                // Upload image to Cloudinary
                using var stream = new MemoryStream();
                await request.IconFile.CopyToAsync(stream);
                stream.Position = 0;

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(imageName, stream),
                    PublicId = imageUrl,
                    Overwrite = true
                };

                await cloudinary.UploadAsync(uploadParams);
            }
            if (request.IconFile == null && request.ServiceName != null)
            {
                service.Name = request.ServiceName;
                _context.Service.Update(service);
            }

            return _context.SaveChanges() > 0;
        }
        public List<EventStatisticals> GetEventStatisticals()
        {
            var data = _context.Event.ToList();
            var list = new List<EventStatisticals>();
            if (data.Count == 0)
            {
                throw new Exception("Empty!");
            }
            foreach (var item in data)
            {
                var customer = _context.Customer.FirstOrDefault(x => x.Id == item.CustomerId);
                var beautician = _context.Beautician.FirstOrDefault(x => x.Id == item.BeauticianId);
                var eventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == item.EventStatusId);
                list.Add(new EventStatisticals
                {
                    Id = item.Id,
                    DateEvent = item.DateEvent,
                    StartTime = item.StartTime,
                    EndTime = item.EndTime,
                    Note = item.Note,
                    Address = item.Address,
                    CustomerId = item.CustomerId,
                    BeauticianId = item.BeauticianId,
                    EventStatusId = item.EventStatusId,
                    CustomerName = customer.FullName,
                    BeauticianName = beautician.FullName,
                    EventStatusName = eventStatus.StatusName,
                });
            }
            return list;
        }

        public List<Title> GetTitle()
        {
            var data = _context.Title.ToList();
            return data;
        }

        public async Task<bool> AddTitle(string titleName)
        {
            var data = new Title()
            {
                TitleName = titleName,
            };
            _context.Title.Add(data);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> UpdateTitle(Title request)
        {
            var data = _context.Title.FirstOrDefault(x => x.Id == request.Id);
            if (data == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            data.TitleName = request.TitleName;
            _context.Title.Update(data);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> DeleteTitle(int TitleId)
        {
            var data = _context.Title.FirstOrDefault(x => x.Id == TitleId);
            if (data == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            _context.RemoveRange(data);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> AddTitleImage(TitleImageRequest request)
        {
            try
            {
                var account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                var cloudinary = new Cloudinary(account);

                foreach (var item in request.ImageFile)
                {
                    var imageName = $"{Path.GetFileNameWithoutExtension(item.FileName)}{Path.GetExtension(item.FileName)}";
                    string img = new String(Path.GetFileNameWithoutExtension(item.FileName));
                    var imageUrl = $"TitleImage/{img}";

                    // Save image information to database
                    var titleImage = new TitleImage { Image = imageName };
                    _context.TitleImage.Add(titleImage);
                    await _context.SaveChangesAsync();

                    // Upload image to Cloudinary
                    using var stream = new MemoryStream();
                    await item.CopyToAsync(stream);
                    stream.Position = 0;

                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(imageName, stream),
                        PublicId = imageUrl,
                        Overwrite = true
                    };

                    await cloudinary.UploadAsync(uploadParams);
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public List<TitleImage> GetTitleImage()
        {
            var data = _context.TitleImage.ToList();
            return data;
        }

        public async Task<bool> DeleteTitleImage(int Id)
        {
            var data = _context.TitleImage.FirstOrDefault(x => x.Id == Id);
            var imgName = Path.GetFileNameWithoutExtension(data.Image);
            if (data == null)
            {
                throw new Exception("Not Found!");
            }
            _context.RemoveRange(data);
            Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

            var cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            var link = $"TitleImage/{imgName}";
            var deletionParams = new DeletionParams(link)
            {
                Invalidate = true,
                Type = "upload",
                ResourceType = ResourceType.Image
            };
            var deletionResult = cloudinary.Destroy(deletionParams);
            return _context.SaveChanges() > 0;
        }
    }
}
