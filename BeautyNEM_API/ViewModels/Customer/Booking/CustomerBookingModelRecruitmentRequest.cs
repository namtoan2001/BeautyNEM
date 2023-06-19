namespace BeautyNEM_API.ViewModels.Customer.Booking
{
    public class CustomerBookingModelRecruitmentRequest
    {
        public string? note { get; set; }
        public int ModelServiceId { get; set; }
        public int customerId { get; set; }
        public int beauticianId { get; set; }
        public string Address { get; set; }
    }
}
