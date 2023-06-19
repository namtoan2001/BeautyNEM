namespace BeautyNEM_API.ViewModels.Beautician.Notification
{
    public class AddNotificationRequest
    {
        public string Title { get; set; }
        public string? Content { get; set; }
        public int? BeauticianId { get; set; }
        public int? EventId { get; set; }
    }
}
