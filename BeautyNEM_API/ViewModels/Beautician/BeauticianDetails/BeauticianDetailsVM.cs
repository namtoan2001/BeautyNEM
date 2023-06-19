namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class BeauticianDetailsVM
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
    }
}
