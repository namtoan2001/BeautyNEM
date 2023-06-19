namespace BeautyNEM_API.ViewModels.Customer.Notification
{
    public class AddNotificationRMRequest
    {
        public string Title { get; set; }
        public string? Content { get; set; }
        public string Address { get; set; }
        public int? CustomerId { get; set; }
        public int? EventRMId { get; set; }
    }
}
