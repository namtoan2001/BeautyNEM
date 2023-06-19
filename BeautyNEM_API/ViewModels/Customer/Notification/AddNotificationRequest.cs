namespace BeautyNEM_API.ViewModels.Customer.Notification
{
    public class AddNotificationRequest
    {
        public string Title { get; set; }
        public string? Content { get; set; }
        public int? CustomerId { get; set; }
        public int? EventId { get; set; }
    }
}
