using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.BeautyShop.Products
{
    public class ProductImageRequest
    {
        public int BeautyShopId { get; set; }
        public int ProductId { get; set; }
        public int? ImageName { get; set; }
        [NotMapped]
        public IList<IFormFile> ImageFile { get; set; }
    }
}
