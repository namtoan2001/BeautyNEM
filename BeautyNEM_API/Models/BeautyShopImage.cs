namespace BeautyNEM_API.Models
{
    public class BeautyShopImage
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public int BeautyShopId { get; set; }
        public int ProductId { get; set; }
        public virtual BeautyShop? BeautyShop { get; set; }
        public virtual Product? Product { get; set; }
    }
}
