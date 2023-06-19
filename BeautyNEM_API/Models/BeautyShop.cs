namespace BeautyNEM_API.Models
{
    public class BeautyShop
    {
        public int Id { get; set; }
        public string StoreName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public virtual City? City { get; set; }
        public virtual District? District { get; set; }
        public double Rating { get; set; }
        public string? Avatar { get; set; }
    }
}
