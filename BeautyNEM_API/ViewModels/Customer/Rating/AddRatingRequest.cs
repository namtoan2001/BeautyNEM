namespace BeautyNEM_API.ViewModels.Customer.Rating
{
    public class AddRatingRequest
    {
        public int StarNumber { get; set; }
        public string? Comment { get; set; }
        public int BeauticianId { get; set; }
        public int EventId { get; set; }
    }
}
