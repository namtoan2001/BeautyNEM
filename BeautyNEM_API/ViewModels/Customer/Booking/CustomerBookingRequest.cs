namespace BeautyNEM_API.ViewModels.Customer.Booking
{
    public class CustomerBookingRequest
    {
        public DateTime dateEvent { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }      
        public string? note { get; set; }
        public string Address { get; set; }
        public int customerId { get; set; }
        public int beauticianId { get; set; }
        public string idServices { get; set; }
        public int sumPrice { get; set; }
    }
}
