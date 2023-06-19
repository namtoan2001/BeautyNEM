namespace BeautyNEM_API.ViewModels.Beautician.Searching
{
    public class SearchRecruitModelRequest
    {
        public string? Keyword { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
    }
}
