namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class BeauticianServiceVM
    {
        public int Id { get; set; }
        public string? BeauticianName { get; set; }
        public string? ServiceName { get; set; }
        public int BeauticianId { get; set; }
        public int ServiceId { get; set; }
        public int Price { get; set; }
        public int? Discount { get; set; }
        public TimeSpan? Time { get; set; }
    }
}
