namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class BeauticianInfomationRequest
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public DateTime BirthDate { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
    }
}
