namespace BeautyNEM_API.ViewModels.Administrator.Statistical
{
    public class BeautyShopStatisticals
    {
        public int Id { get; set; }
        public string StoreName { get; set; }
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
        public string? Avatar { get; set; }
    }
}
