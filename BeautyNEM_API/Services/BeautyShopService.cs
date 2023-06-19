using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.BeautyShop.Account;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class BeautyShopService : IBeautyShopService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BeautyShopService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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
        public List<BeautyShopVM> GetListBeautyShop()
        {
            var data = _context.BeautyShop
                 .Select(n => new BeautyShopVM
                 {
                     id = n.Id,
                     storeName = n.StoreName,
                     districtName = n.District.Name,
                     cityName = n.City.Name,
                     Rating = n.Rating,
                     Avatar = n.Avatar,
                     phoneNumber = n.PhoneNumber
                     
                 }).ToList();
            return data;
        }
        public BeautyShopDetailsVM GetBeautyShopDetailsWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var data = _context.BeautyShop.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (data == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            var city = _context.City.FirstOrDefault(x => x.Id == data.CityId);
            var district = _context.District.FirstOrDefault(x => x.Id == data.DistrictId);
            return new BeautyShopDetailsVM
            {
                id = data.Id,
                StoreName = data.StoreName,
                Username = data.Username,
                PhoneNumber = data.PhoneNumber,
                CityId = data.CityId,
                CityName = city.Name,
                DistrictId = district.Id,
                DistrictName = district.Name,
                Avatar = data.Avatar,
            };
        }
        public BeautyShopDetailsVM GetBeautyShopDetailsWithId(int shopId)
        {
            
            var data = _context.BeautyShop.FirstOrDefault(x => x.Id == shopId);
            if (data == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            var city = _context.City.FirstOrDefault(x => x.Id == data.CityId);
            var district = _context.District.FirstOrDefault(x => x.Id == data.DistrictId);
            return new BeautyShopDetailsVM
            {
                id = data.Id,
                StoreName = data.StoreName,
                Username = data.Username,
                PhoneNumber = data.PhoneNumber,
                CityId = data.CityId,
                CityName = city.Name,
                DistrictId = district.Id,
                DistrictName = district.Name,
                Avatar = data.Avatar,
            };
        }
        public List<BeautyShopImageVM> GetListBeautyShopImageWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var img = _context.BeautyShopImage.Where(x => x.BeautyShopId == Int32.Parse(claimId.Value));
            var imglist = new List<BeautyShopImageVM>();
            if (img.Count() == 0)
            {
                throw new Exception("Không tìm thấy!");
            }
            foreach (var item in img)
            {
                imglist.Add(new BeautyShopImageVM
                {
                    Id = item.Id,
                    Image = item.Image,
                    BeautyShopId = item.BeautyShopId
                });
            }
            return imglist;
        }

        public async Task<bool> UpdateBeautyShop(BeautyShopRequest request)
        {
            var data = _context.BeautyShop.FirstOrDefault(x => x.Id == request.id);
            if (data == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            data.StoreName = request.StoreName;
            data.CityId = request.CityId;
            data.DistrictId = request.DistrictId;
            _context.BeautyShop.Update(data);
            return _context.SaveChanges() > 0;
        }
        public async Task<bool> UpdatePasswordBeautyShop(BeautyShopPasswordRequest request)
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautyShop = _context.BeautyShop.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautyShop == null)
            {
                throw new Exception($"Không tìm thấy tài khoản với ID là {Int32.Parse(claimId.Value)}");
            }
            if (request.oldPassword == "" || request.newPassword == "")
            {
                throw new Exception("Vui lòng nhập đầy đủ thông tin");
            }
            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.oldPassword, beautyShop.Password);
            if (!isCorrect)
            {
                throw new Exception("Mật khẩu cũ không chính xác");
            }
            string hashpw = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
            beautyShop.Password = hashpw;
            _context.BeautyShop.Update(beautyShop);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<bool> UpdateAvatarBeautyShop(BeautyShopAvatarRequest request)
        {
            try
            {
                var data = _context.BeautyShop.FirstOrDefault(x => x.Id == request.BeautyShopId);
                string link = null;
                Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                Cloudinary cloudinary = new Cloudinary(account);
                cloudinary.Api.Secure = true;

                if (data.Avatar == null)
                {
                    foreach (var file in request.AvtImgFile)
                    {
                        string imgName = new String(Path.GetFileNameWithoutExtension(file.FileName));
                        string img = new String(Path.GetFileNameWithoutExtension(file.FileName));
                        imgName = imgName + Path.GetExtension(file.FileName);
                        data.Avatar = imgName;
                        _context.BeautyShop.Update(data);
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            System.Threading.Thread.Sleep(1000);
                            var filebytes = ms.ToArray();
                            Stream stream = new MemoryStream(filebytes);
                            string url = $"BeautyShop/Avatar/Id_{request.BeautyShopId}/{img}";
                            var uploadParams = new ImageUploadParams()
                            {
                                File = new FileDescription(imgName, stream),
                                PublicId = url,
                                Overwrite = true,
                            };
                            var uploadResult = cloudinary.Upload(uploadParams);
                        }
                    }
                }
                else
                {
                    link = $"BeautyShop/Avatar/Id_{request.BeautyShopId}/{Path.GetFileNameWithoutExtension(data.Avatar)}";
                    var deletionParams = new DeletionParams(link)
                    {
                        Invalidate = true,
                        Type = "upload",
                        ResourceType = ResourceType.Image
                    };
                    var deletionResult = cloudinary.Destroy(deletionParams);
                    foreach (var file in request.AvtImgFile)
                    {
                        string imgName = new String(Path.GetFileNameWithoutExtension(file.FileName));
                        string img = new String(Path.GetFileNameWithoutExtension(file.FileName));
                        string url = $"BeautyShop/Avatar/Id_{request.BeautyShopId}/{img}";
                        imgName = imgName + Path.GetExtension(file.FileName);
                        link = Path.Combine(imgName);
                        data.Avatar = imgName;
                        _context.BeautyShop.Update(data);
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            System.Threading.Thread.Sleep(1000);
                            var filebytes = ms.ToArray();
                            Stream stream = new MemoryStream(filebytes);
                            var uploadParams = new ImageUploadParams()
                            {
                                File = new FileDescription(imgName, stream),
                                PublicId = url,
                                Overwrite = true,
                            };
                            var uploadResult = cloudinary.Upload(uploadParams);
                        }
                    }
                }
                return _context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public List<BeautyShopImageVM> GetListBeautyShopImageWithProductId(int BeautyShopId, int ProductId)
        {
            var data = _context.BeautyShopImage.Where(x => x.BeautyShopId == BeautyShopId);
            var img = data.Where(x => x.ProductId == ProductId);
            var imglist = new List<BeautyShopImageVM>();
            if (img.Count() == 0)
            {
                throw new Exception("Không tìm thấy!");
            }
            foreach (var item in img)
            {
                imglist.Add(new BeautyShopImageVM
                {
                    Id = item.Id,
                    Image = item.Image,
                    BeautyShopId = item.BeautyShopId
                });
            }
            return imglist;
        }
    }
}
