namespace BeautyNEM_API.ViewModels.Beautician.Searching
{
    public class SearchFilterRequest
    {
        public string? Keyword { get; set; }
        public int FromPrice { get; set; }
        public int ToPrice { get; set; }
        public string? ServiceIds { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public int StarNumber { get; set; }
        public string? Avatar { get; set; }
    }
}
