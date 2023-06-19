namespace BeautyNEM_API.ViewModels.Shared
{
    public class SearchFilterSortRequest
    {
        public string? Keyword { get; set; }
        public string? ServiceIds { get; set; }
        public int SortingId { get; set; }
    }
}
