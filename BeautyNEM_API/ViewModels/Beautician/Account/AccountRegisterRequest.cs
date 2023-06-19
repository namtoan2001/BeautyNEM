namespace BeautyNEM_API.ViewModels.Beautician.Account
{
    public class AccountRegisterRequest
    {
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string BirthDate { get; set; }
        public string? ServiceIds { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
    }
}
