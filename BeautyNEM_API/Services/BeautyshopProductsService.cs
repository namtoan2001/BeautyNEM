using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.BeautyShop.Products;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace BeautyNEM_API.Services
{
    public class BeautyshopProductsService : IBeautyShopProductService
    {
        private readonly BeautyNEMContext _context;
        public BeautyshopProductsService(BeautyNEMContext context)
        {
            _context = context;
        }

        public async Task<bool> AddProduct(ProductRequest request)
        {
            if (request.productName == null
                || request.productDescription == null
                || request.price == 0
                || request.shopId == 0)

                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            var beautyShop = await _context.BeautyShop.FirstOrDefaultAsync(x => x.Id == request.shopId);
            if (beautyShop == null)
                throw new Exception("Không tìm thấy cửa hàng");


            var product = new Product()
            {
                productName = request.productName,
                productDescription = request.productDescription,
                price = request.price,
                //shopId = request.shopId,
                Shop = beautyShop,

            };

            try
            {
                _context.Product.Add(product);
                await _context.SaveChangesAsync();
                if (product.id > 0)
                {
                    var dataimg = new BeautyShopImage();
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
                        link = $"BeautyShop/ImageProduct/Id_{product.shopId}/{imgName}";
                        dataimg = new BeautyShopImage
                        {
                            BeautyShopId = request.shopId,
                            ProductId = product.id,
                            Image = imgName,
                        };
                        _context.BeautyShopImage.Add(dataimg);
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            System.Threading.Thread.Sleep(1000);
                            var filebytes = ms.ToArray();
                            Stream stream = new MemoryStream(filebytes);
                            string url = $"BeautyShop/ImageProduct/Id_{product.shopId}/{img}";
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
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                if (e.InnerException != null)
                    System.Diagnostics.Debug.WriteLine(e.InnerException.Message);
            }


            return _context.SaveChanges() > 0;
        }

        public List<Product> GetShopProduct(int shopId)
        {

            var beautyShop = _context.BeautyShop.FirstOrDefault(x => x.Id == shopId);
            if (beautyShop == null)
                throw new Exception("Không tìm thấy cửa hàng");
            var products = _context.Product
                .Where(x => x.shopId == shopId)
                .ToList();
            var productList = new List<Product>();
            foreach (var product in products)
            {
                productList.Add(new Product
                {
                    id = product.id,
                    shopId = product.shopId,
                    productName = product.productName,
                    price = product.price,
                    productDescription = product.productDescription
                });
            }
            return productList;
        }

        public async Task<bool> UpdateShopProduct(ProductVM request)
        {
            var product = _context.Product.FirstOrDefault(x => x.id == request.id);
            if (product == null)
            {
                throw new Exception("Khong tim thay san pham");
            }

            product.productName = request.productName;
            product.price = request.price;
            product.productDescription = request.productDescription;
            _context.Product.Update(product);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> DeleteshopProduct(int productId, int shopId)
        {
            var data = _context.Product.Where(x => x.shopId == shopId);
            var product = data.FirstOrDefault(x => x.id == productId);
            var img = _context.BeautyShopImage.Where(x => x.ProductId == productId);
            var img1 = img.Where(x => x.BeautyShopId == shopId);
            if (img.Count() == 0)
            {
                throw new Exception($"Không tìm thấy dữ liệu");
            }
            if (img1.Count() == 0)
            {
                throw new Exception($"Không tìm thấy dữ liệu");
            }
            if (data == null)
            {
                throw new Exception($"Không tìm thấy dữ liệu có mã là {shopId}");
            }
            if (product == null)
            {
                throw new Exception($"Không tìm thấy dữ liệu có mã là {productId}");
            }
            Account account = new Account(
                    "dpwifnuax",
                    "817342852663177",
                    "XHilYh4d2vklt733wnKRZxM-mag");

            var cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            foreach (var item in img1)
            {
                var name = Path.GetFileNameWithoutExtension(item.Image);
                var link = $"BeautyShop/ImageProduct/Id_{product.shopId}/{name}";
                var deletionParams = new DeletionParams(link)
                {
                    Invalidate = true,
                    Type = "upload",
                    ResourceType = ResourceType.Image
                };
                var deletionResult = cloudinary.Destroy(deletionParams);
            }
            _context.RemoveRange(img1);
            _context.RemoveRange(product);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> DeleteBeautyShopImage(int BeautyShopId, int productId, string imageName)
        {
            var data = _context.BeautyShopImage.Where(x => x.BeautyShopId == BeautyShopId).Where(x => x.ProductId == productId);
            var img = data.FirstOrDefault(x => x.Image == imageName);
            if (data.Count() == 0)
            {
                throw new Exception("Không tìm thấy dữ liệu!");
            }
            if (img == null)
            {
                throw new Exception("Không tìm thấy dữ liệu!");
            }
            Account account = new Account(
                  "dpwifnuax",
                  "817342852663177",
                  "XHilYh4d2vklt733wnKRZxM-mag");

            var cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            var name = Path.GetFileNameWithoutExtension(imageName);
            var link = $"BeautyShop/ImageProduct/Id_{img.BeautyShopId}/{name}";
            var deletionParams = new DeletionParams(link)
            {
                Invalidate = true,
                Type = "upload",
                ResourceType = ResourceType.Image
            };
            var deletionResult = cloudinary.Destroy(deletionParams);
            _context.RemoveRange(img);
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> AddProductImage(ProductImageRequest request)
        {
            try
            {
                var data = new BeautyShopImage();
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
                    link = $"BeautyShop/ImageProduct/Id_{request.BeautyShopId}/{imgName}";
                    data = new BeautyShopImage
                    {
                        BeautyShopId = request.BeautyShopId,
                        ProductId = request.ProductId,
                        Image = imgName,
                    };
                    _context.BeautyShopImage.Add(data);
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        System.Threading.Thread.Sleep(1000);
                        var filebytes = ms.ToArray();
                        Stream stream = new MemoryStream(filebytes);
                        string url = $"BeautyShop/ImageProduct/Id_{request.BeautyShopId}/{img}"; ;
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
    }
}
