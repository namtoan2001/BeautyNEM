namespace BeautyNEM_API.Models
{
    public class Product
    {
        public int id { get; set; }
        public string productName { get; set; }
        public string productDescription { get; set; }
        public double price { get; set; }
        public int shopId { get; set; }
        public virtual BeautyShop? Shop { get; set; }
    }
}
