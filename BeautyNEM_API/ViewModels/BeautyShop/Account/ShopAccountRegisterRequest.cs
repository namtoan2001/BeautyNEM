namespace BeautyNEM_API.ViewModels.BeautyShop.Account
{
    public class ShopAccountRegisterRequest
    {
        public string Username { get; set; }
        public string StoreName { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
    }
}
