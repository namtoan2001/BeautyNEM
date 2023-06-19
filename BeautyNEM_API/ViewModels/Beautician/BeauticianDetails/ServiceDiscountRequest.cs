namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class ServiceDiscountRequest
    {
        public int BeauticianId { get; set; }
        public int ServiceId { get; set; }
        public int? Discount { get; set; }
    }
}
