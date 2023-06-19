namespace BeautyNEM_API.ViewModels.Administrator.Statistical
{
    public class BeauticianStatisticals
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
        public double StarNumber { get; set; }
        public string? Avatar { get; set; }
    }
}
