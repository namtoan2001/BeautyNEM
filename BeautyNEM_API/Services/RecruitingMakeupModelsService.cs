using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.RecruitingMakeupModels;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BeautyNEM_API.Services
{
    public class RecruitingMakeupModelsService : IRecruitingMakeupModelsService
    {
        private readonly BeautyNEMContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RecruitingMakeupModelsService(BeautyNEMContext context, IWebHostEnvironment webHostEnvironment, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            this._webHostEnvironment = webHostEnvironment;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
        }
        public List<RecruitingMakeupModelsDetailsVM> GetListRecruitingMakeupModels()
        {
            var data = _context.RecruitingMakeupModels
                 .Select(n => new RecruitingMakeupModelsDetailsVM
                 {
                     Id = n.Id,
                     Price = n.Price,
                     Description = n.Description,
                     Date = n.Date,
                     name = n.Name,
                     BeauticianId = n.BeauticianId,
                 }).ToList();
            return data;
        }
        public RecruitingMakeupModelsDetailsVM GetRecruitingMakeupModelsDetailsWithId(int id)
        {
            var data = _context.RecruitingMakeupModels.FirstOrDefault(x => x.Id == id);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == data.BeauticianId);
            if (data == null)
            {
                throw new Exception("Không tìm thấy!");
            }
            return new RecruitingMakeupModelsDetailsVM
            {
                Id = data.Id,
                name = data.Name,
                Date = data.Date,
                Price = data.Price,
                Description = data.Description,
                BeauticianName = beautician.FullName,
                BeauticianId = data.BeauticianId,
            };
        }
        public List<RecruitingMakeupModelsImageVM> GetListRecruitingMakeupModelsImage(int id)
        {
            var RMM = _context.RecruitingMakeupModelsImage.Where(x => x.RecruitingMakeupModelsId == id);
            var recruitingMakeupModelsImageVMs = new List<RecruitingMakeupModelsImageVM>();
            if (RMM == null)
            {
                throw new Exception("Not Found");
            }
            foreach (var list in RMM)
            {
                recruitingMakeupModelsImageVMs.Add(new RecruitingMakeupModelsImageVM
                {
                    Id = list.Id,
                    RecruitingMakeupModelsId = list.RecruitingMakeupModelsId,
                    ImageName = list.Image,
                });
            }
            return recruitingMakeupModelsImageVMs;
        }

        public async Task<bool> AddRecruitingMakeupModels(RecruitingMakeupModelsRequest request)
        {
            var data = new RecruitingMakeupModels();
            data = new RecruitingMakeupModels()
            {
                Price = request.Price,
                Name = request.Name,
                Description = request.Description,
                BeauticianId = request.BeauticianId,
            };
            _context.RecruitingMakeupModels.Add(data);
            await _context.SaveChangesAsync();

            if (data.Id > 0)
            {
                var dataimg = new RecruitingMakeupModelsImage();
                string link = null;
                Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                Cloudinary cloudinary = new Cloudinary(account);
                cloudinary.Api.Secure = true;
                foreach (var file in request.ImageFile)
                {
                    string imgName = new String(Path.GetFileNameWithoutExtension(file.FileName));
                    string img = new String(Path.GetFileNameWithoutExtension(file.FileName));
                    imgName = imgName + Path.GetExtension(file.FileName);
                    link = $"RecruitingMakeupModels/Image/Id_{data.Id}/{imgName}";
                    dataimg = new RecruitingMakeupModelsImage
                    {
                        RecruitingMakeupModelsId = data.Id,
                        Image = imgName,
                    };
                    _context.RecruitingMakeupModelsImage.Add(dataimg);
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        System.Threading.Thread.Sleep(1000);
                        var filebytes = ms.ToArray();
                        Stream stream = new MemoryStream(filebytes);
                        string url = $"RecruitingMakeupModels/Image/Id_{data.Id}/{img}";
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
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> UpdateRecruitingMakeupModels(RecruitingMakeupModelsUpdateRequest request)
        {
            try
            {
                var data = _context.RecruitingMakeupModels.FirstOrDefault(x => x.Id == request.Id);
                if (data == null)
                {
                    throw new Exception("Không tìm thấy dữ liệu!");
                }
                else
                {
                    data.Price = request.Price;
                    data.Description = request.Description;
                    data.Name = request.Name;
                    _context.RecruitingMakeupModels.Update(data);
                }
                return _context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteRecruitingMakeupModels(int id)
        {
            var data = _context.RecruitingMakeupModels.FirstOrDefault(x => x.Id == id);
            var img = _context.RecruitingMakeupModelsImage.Where(x => x.RecruitingMakeupModelsId == id);
            var isCheck = _context.EventModelRecruit.Where(x => x.RecruitingMakeupModels.Id == data.Id);
            if (data == null)
            {
                throw new Exception($"Không tìm thấy dữ liệu có mã là {data}");
            }
            if (isCheck.Count() != 0)
            {
                throw new Exception("Đã có người đặt lịch, không thể xóa!");
            };
            Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

            var cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            foreach (var item in img)
            {
                var name = Path.GetFileNameWithoutExtension(item.Image);
                var link = $"RecruitingMakeupModels/Image/Id_{data.Id}/{name}";
                var deletionParams = new DeletionParams(link)
                {
                    Invalidate = true,
                    Type = "upload",
                    ResourceType = ResourceType.Image
                };
                var deletionResult = cloudinary.Destroy(deletionParams);
            }
            _context.RemoveRange(img);
            _context.RemoveRange(data);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> AddRecruitingMakeupModelsImage(RecruitingMakeupModelsImageVM request)
        {
            try
            {
                var data = new RecruitingMakeupModelsImage();
                string link = null;
                Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

                Cloudinary cloudinary = new Cloudinary(account);
                cloudinary.Api.Secure = true;
                foreach (var file in request.ImageFile)
                {
                    string imgName = new String(Path.GetFileNameWithoutExtension(file.FileName));
                    string img = new String(Path.GetFileNameWithoutExtension(file.FileName));
                    imgName = imgName + Path.GetExtension(file.FileName);
                    link = $"RecruitingMakeupModels/Image/Id_{request.RecruitingMakeupModelsId}/{imgName}";
                    data = new RecruitingMakeupModelsImage
                    {
                        RecruitingMakeupModelsId = request.RecruitingMakeupModelsId,
                        Image = imgName,
                    };
                    _context.RecruitingMakeupModelsImage.Add(data);
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        System.Threading.Thread.Sleep(1000);
                        var filebytes = ms.ToArray();
                        Stream stream = new MemoryStream(filebytes);
                        string url = $"RecruitingMakeupModels/Image/Id_{request.RecruitingMakeupModelsId}/{img}";
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

        public async Task<bool> DeleteRecruitingMakeupModelsImage(int recruitingMakeupModelsId, string imageName)
        {
            var data = _context.RecruitingMakeupModelsImage.Where(x => x.RecruitingMakeupModelsId == recruitingMakeupModelsId).ToList();
            var name = Path.GetFileNameWithoutExtension(imageName);
            var img = data.FirstOrDefault(x => x.Image == imageName);
            {
                if (data.Count == 0)
                    throw new Exception($"Không tìm thấy dữ liệu có mã là {recruitingMakeupModelsId}");
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
            var link = $"RecruitingMakeupModels/Image/Id_{recruitingMakeupModelsId}/{name}";
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
