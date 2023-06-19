using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.BeauticianDetails;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class BeauticianDetailsService : IBeauticianDetailsService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BeauticianDetailsService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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

        public BeauticianDetailsVM GetBeauticianDetailsWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beauticianDetails = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beauticianDetails == null)
            {
                throw new Exception("Không tìm thấy");
            }
            var city = _context.City.FirstOrDefault(x => x.Id == beauticianDetails.CityId);
            var district = _context.District.FirstOrDefault(x => x.Id == beauticianDetails.DistrictId);
            return new BeauticianDetailsVM
            {
                Id = beauticianDetails.Id,
                FullName = beauticianDetails.FullName,
                Username = beauticianDetails.Username,
                Password = beauticianDetails.Password,
                PhoneNumber = beauticianDetails.PhoneNumber,
                BirthDate = beauticianDetails.BirthDate,
                City = city.Name,
                District = district.Name,
                CityId = city.Id,
                DistrictId = district.Id,
            };
        }

        public List<BeauticianServiceVM> GetSkill(int id)
        {
            var skill = _context.Skill.Where(x => x.BeauticianId == id).ToList();
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == id);
            if (beautician == null)
            {
                throw new Exception("Not Found");
            }
            var serviceList = new List<BeauticianServiceVM>();
            foreach (var Skill in skill)
            {
                var service = _context.Service.FirstOrDefault(x => x.Id == Skill.ServiceId);
                serviceList.Add(new BeauticianServiceVM
                {
                    Id = Skill.Id,
                    BeauticianName = beautician.FullName,
                    ServiceName = service.Name,
                    BeauticianId = beautician.Id,
                    ServiceId = service.Id,
                    Price = Skill.Price,
                    Discount = Skill.Discount,
                    Time = Skill.Time,
                });
            }
            return serviceList;
        }
        public List<BeauticianRatingVM> GetRating(int id)
        {
            var rating = _context.Rating.Where(x => x.BeauticianId == id).ToList();
            var ratingList = new List<BeauticianRatingVM>();
            if (rating.Count == 0)
            {
                throw new Exception("Not Found");
            }
            foreach (var Rating in rating)
            {
                var username = _context.Customer.FirstOrDefault(x => x.Id == Rating.CustomerId);
                ratingList.Add(new BeauticianRatingVM
                {
                    Id = Rating.Id,
                    Comment = Rating.Comment,
                    rating = Rating.StarNumber,
                    username = username.FullName,
                    Image = Rating.Image,
                });
            }
            return ratingList;
        }

        public List<BeauticianImageVM> GetImage(int id)
        {
            var beauticianImg = _context.BeauticianImage.Where(x => x.BeauticianId == id).ToList();
            var ImageList = new List<BeauticianImageVM>();
            if (beauticianImg.Count == 0)
            {
                throw new Exception("Not Found");
            }
            foreach (var imgList in beauticianImg)
            {
                ImageList.Add(new BeauticianImageVM
                {
                    Id = imgList.Id,
                    BeauticianId = imgList.BeauticianId,
                    ImageLink = imgList.ImageLink,
                    ServiceId = imgList.ServiceId,
                });
            }
            //string path = Path.Combine(_webHostEnvironment.ContentRootPath, "BeauticianImages", "BeauticianId_" + id);
            //if (!Directory.Exists(path))
            //{
            //    //throw new Exception("Not Found");
            //    beauticianImageVMs = null;
            //}
            //else
            //{
            //    foreach (string file in Directory.GetFiles(path))
            //    {
            //        string imgName = new String(Path.GetFileNameWithoutExtension(file));
            //        imgName = imgName + Path.GetExtension(file);
            //        byte[] bytes = File.ReadAllBytes(file);
            //        beauticianImageVMs.Add(new BeauticianImageVM
            //        {
            //            BeauticianId = beauticianImg.BeauticianId,
            //            ImageName = imgName,
            //            ImageLink = Convert.ToBase64String(bytes),
            //        });
            //    };
            //}
            return ImageList;
        }
        public List<BeauticianImageVM> GetImageWithServiceId(int beauticianId, int serviceId)
        {
            var beautician = _context.BeauticianImage.Where(x => x.BeauticianId == beauticianId);
            var data = beautician.Where(x => x.ServiceId == serviceId);
            var imgList = new List<BeauticianImageVM>();
            if (data.Count() == 0)
            {
                throw new Exception("Not Found!");
            }
            foreach (var list in data)
            {
                imgList.Add(new BeauticianImageVM
                {
                    Id = list.Id,
                    BeauticianId = list.BeauticianId,
                    ImageLink = list.ImageLink,
                    ServiceId = list.ServiceId,
                });
            }
            return imgList;
        }
        public async Task<bool> UpdateBeauticianInfo(BeauticianInfomationRequest request)
        {
            var account = _context.Beautician.FirstOrDefault(x => x.Id == request.Id);
            if (account == null)
            {
                throw new NotImplementedException();
            }
            account.FullName = request.FullName;
            account.CityId = request.CityId;
            account.DistrictId = request.DistrictId;
            account.BirthDate = request.BirthDate;
            _context.Beautician.Update(account);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> AddImgBeautician(BeauticianImageVM request)
        {
            try
            {
                var data = new BeauticianImage();
                string link = null;
                Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                Cloudinary cloudinary = new Cloudinary(account);
                cloudinary.Api.Secure = true;

                foreach (var file in request.imgFile)
                {
                    string imgName = new String(Path.GetFileNameWithoutExtension(file.FileName));
                    string img = new String(Path.GetFileNameWithoutExtension(file.FileName));
                    imgName = imgName + Path.GetExtension(file.FileName);
                    link = $"IMG/Beautician_{request.BeauticianId}/{imgName}";
                    data = new BeauticianImage()
                    {
                        BeauticianId = request.BeauticianId,
                        ImageLink = imgName,
                        ServiceId = request.ServiceId
                    };
                    _context.BeauticianImage.Add(data);
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        System.Threading.Thread.Sleep(1000);
                        var filebytes = ms.ToArray();
                        Stream stream = new MemoryStream(filebytes);
                        string url = $"IMG/Beautician_{request.BeauticianId}/{img}";
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(img, stream),
                            PublicId = url,
                            Overwrite = true,
                        };
                        var uploadResult = cloudinary.Upload(uploadParams);
                    }
                }
                return _context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteImgBeautician(int beauticianId, string imageLink)
        {
            var data = _context.BeauticianImage.Where(x => x.BeauticianId == beauticianId).ToList();
            var name = Path.GetFileNameWithoutExtension(imageLink);
            var img = data.FirstOrDefault(x => x.ImageLink == imageLink);
            if (data == null)
            {
                throw new Exception($"Không tìm thấy dữ liệu có mã là {beauticianId}");
            }
            if (img == null)
            {
                throw new Exception($"Không tìm thấy ảnh");
            }
            _context.RemoveRange(img);
            Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

            var cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            var link = $"IMG/Beautician_{beauticianId}/{name}";
            var deletionParams = new DeletionParams(link)
            {
                Invalidate = true,
                Type = "upload",
                ResourceType = ResourceType.Image
            };
            var deletionResult = cloudinary.Destroy(deletionParams);
            return _context.SaveChanges() > 0;
        }

        public async Task<int> AddBeauticianService(BeauticianServiceRequest request)
        {
            var data = _context.Skill.Where(x => x.BeauticianId == request.BeauticianId);
            var checkService = data.FirstOrDefault(x => x.ServiceId == request.ServiceId);
            if (checkService != null)
            {
                throw new Exception("Dịch vụ này đã tồn tại");
            }
            var skill = new Skill()
            {
                BeauticianId = request.BeauticianId,
                ServiceId = request.ServiceId,
                Price = request.Price,
            };
            _context.Skill.Add(skill);
            _context.SaveChanges();
            return skill.Id;
        }

        public async Task<bool> UpdateBeauticianService(BeauticianServiceRequest request)
        {
            var data = _context.Skill.Where(x => x.BeauticianId == request.BeauticianId);
            var skill = data.FirstOrDefault(x => x.ServiceId == request.ServiceId);
            if (skill == null)
            {
                throw new Exception("Không tìm thấy dịch vụ");
            }
            skill.ServiceId = request.ServiceId;
            skill.Price = request.Price;
            if (request.Discount != 0)
            {
                skill.Discount = request.Discount;
            }
            skill.Time = request.Time;
            _context.Skill.Update(skill);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> DeleteBeauticianService(int BeauticianId, int serviceId)
        {
            var data = _context.Skill.Where(x => x.BeauticianId == BeauticianId);
            var skill = data.FirstOrDefault(x => x.ServiceId == serviceId);
            if (data == null)
            {
                throw new Exception($"Không tìm thấy dữ liệu có mã là {BeauticianId}");
            }
            if (skill == null)
            {
                throw new Exception($"Không tìm thấy dữ liệu có mã là {serviceId}");
            }
            _context.RemoveRange(skill);
            return _context.SaveChanges() > 0;
        }

        public BeauticianDetailsVM GetBeauticianDetails(int id)
        {
            var beauticianDetails = _context.Beautician.FirstOrDefault(x => x.Id == id);
            if (beauticianDetails == null)
            {
                throw new Exception("Không tìm thấy");
            }
            var city = _context.City.FirstOrDefault(x => x.Id == beauticianDetails.CityId);
            var district = _context.District.FirstOrDefault(x => x.Id == beauticianDetails.DistrictId);
            return new BeauticianDetailsVM
            {
                Id = beauticianDetails.Id,
                FullName = beauticianDetails.FullName,
                Username = beauticianDetails.Username,
                Password = beauticianDetails.Password,
                PhoneNumber = beauticianDetails.PhoneNumber,
                BirthDate = beauticianDetails.BirthDate,
                City = city.Name,
                District = district.Name,
            };
        }

        public async Task<bool> UpdateBeauticianPassword(BeauticianPasswordRequest request)
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
            {
                throw new Exception($"Không tìm thấy tài khoản với ID là {Int32.Parse(claimId.Value)}");
            }
            if (request.oldPassword == "" || request.newPassword == "")
            {
                throw new Exception("Vui lòng nhập đầy đủ thông tin");
            }
            bool isCorrect = BCrypt.Net.BCrypt.Verify(request.oldPassword, beautician.Password);
            if (!isCorrect)
            {
                throw new Exception("Mật khẩu cũ không chính xác");
            }
            string hashpw = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
            beautician.Password = hashpw;
            _context.Beautician.Update(beautician);
            return await _context.SaveChangesAsync() > 0;
        }

        public List<BeauticianServiceVM> GetSkillWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var skill = _context.Skill.Where(x => x.BeauticianId == Int32.Parse(claimId.Value)).ToList();
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (skill == null)
            {
                throw new Exception("Not Found");
            }
            var serviceList = new List<BeauticianServiceVM>();
            foreach (var Skill in skill)
            {
                var service = _context.Service.FirstOrDefault(x => x.Id == Skill.ServiceId);
                serviceList.Add(new BeauticianServiceVM
                {
                    Id = Skill.Id,
                    BeauticianName = beautician.FullName,
                    ServiceName = service.Name,
                    BeauticianId = beautician.Id,
                    ServiceId = service.Id,
                    Price = Skill.Price,
                    Discount = Skill.Discount,
                    Time = Skill.Time
                });
            }
            return serviceList;
        }

        public List<BeauticianRatingVM> GetRatingWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var rating = _context.Rating.Where(x => x.BeauticianId == Int32.Parse(claimId.Value)).ToList();
            var ratingList = new List<BeauticianRatingVM>();
            if (rating == null)
            {
                throw new Exception("Not Found");
            }
            foreach (var Rating in rating)
            {
                var username = _context.Customer.FirstOrDefault(x => x.Id == Rating.CustomerId);
                ratingList.Add(new BeauticianRatingVM
                {
                    Id = Rating.Id,
                    Comment = Rating.Comment,
                    rating = Rating.StarNumber,
                    username = username.FullName,
                });
            }
            return ratingList;
        }

        public List<BeauticianImageVM> GetImageWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beauticianImg = _context.BeauticianImage.Where(x => x.BeauticianId == Int32.Parse(claimId.Value)).ToList();
            var ImageList = new List<BeauticianImageVM>();
            if (beauticianImg == null)
            {
                throw new Exception("Not Found");
            }
            foreach (var imgList in beauticianImg)
            {
                ImageList.Add(new BeauticianImageVM
                {
                    BeauticianId = imgList.BeauticianId,
                    ImageLink = imgList.ImageLink,
                });
            }
            return ImageList;
        }

        public BeauticianAvatarVM GetAvatarWithToken()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beauticianAvt = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            return new BeauticianAvatarVM
            {
                BeauticianId = beauticianAvt.Id,
                AvatarName = beauticianAvt.Avatar
            };
        }

        public async Task<bool> UpdateBeauticianAvatar(BeauticianAvatarVM request)
        {
            try
            {
                var data = _context.Beautician.FirstOrDefault(x => x.Id == request.BeauticianId);
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
                        _context.Beautician.Update(data);
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            System.Threading.Thread.Sleep(1000);
                            var filebytes = ms.ToArray();
                            Stream stream = new MemoryStream(filebytes);
                            string url = $"BeauticianAvatar/Id_{request.BeauticianId}/{img}";
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
                    link = $"BeauticianAvatar/Id_{request.BeauticianId}/{Path.GetFileNameWithoutExtension(data.Avatar)}";
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
                        string url = $"BeauticianAvatar/Id_{request.BeauticianId}/{img}";
                        imgName = imgName + Path.GetExtension(file.FileName);
                        link = Path.Combine(imgName);
                        data.Avatar = imgName;
                        _context.Beautician.Update(data);
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

        public async Task<bool> HandleDiscount(ServiceDiscountRequest request)
        {
            var data = _context.Skill.Where(x => x.BeauticianId == request.BeauticianId);
            var skill = data.FirstOrDefault(x => x.ServiceId == request.ServiceId);
            if (skill == null)
            {
                throw new Exception("Không tìm thấy dịch vụ");
            }
            skill.Discount = request.Discount;
            _context.Skill.Update(skill);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> UpdateWorkingTime(BeauticianWorkingTime request)
        {
            var data = _context.Skill.Where(x => x.BeauticianId == request.BeauticianId);
            var skill = data.FirstOrDefault(x => x.ServiceId == request.ServiceId);
            if (skill == null)
            {
                throw new Exception("Không tìm thấy dịch vụ");
            }
            skill.Time = request.Time;
            _context.Skill.Update(skill);
            return _context.SaveChanges() > 0;
        }
    }
}
