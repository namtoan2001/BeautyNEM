using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.BeautyShop.Products
{
    public class ProductRequest
    {
        public int shopId { get; set; }

        public string productName { get; set; }

        public string productDescription { get; set; }

        public float price { get; set; }
        [NotMapped]
        public IList<IFormFile> ImageFile { get; set; }
    }
}
