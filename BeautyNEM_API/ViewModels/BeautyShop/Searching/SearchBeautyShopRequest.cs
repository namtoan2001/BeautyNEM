namespace BeautyNEM_API.ViewModels.BeautyShop.Searching
{
    public class SearchBeautyShopRequest
    {
        public string? Keyword { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
    }
}

