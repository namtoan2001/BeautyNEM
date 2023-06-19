using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.BeautyShop.Products;

namespace BeautyNEM_API.Interfaces
{
    public interface IBeautyShopProductService
    {
        public Task<bool> AddProduct(ProductRequest request);
        public Task<bool> AddProductImage(ProductImageRequest request);
        public List<Product> GetShopProduct(int shopId);
        public Task<bool> UpdateShopProduct(ProductVM request);
        public Task<bool> DeleteshopProduct(int productId, int shopId);
        public Task<bool> DeleteBeautyShopImage(int BeautyShopId, int productId, string imageName);

    }
}
