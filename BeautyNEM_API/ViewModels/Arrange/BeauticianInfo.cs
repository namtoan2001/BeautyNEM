namespace BeautyNEM_API.ViewModels.Arrange
{
    public class BeauticianInfo
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public double StarNumber { get; set; }
        public string? Avatar { get; set; }
    }
}
