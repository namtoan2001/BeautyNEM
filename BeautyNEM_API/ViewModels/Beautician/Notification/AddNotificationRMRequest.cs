namespace BeautyNEM_API.ViewModels.Beautician.Notification
{
    public class AddNotificationRMRequest
    {
        public string Title { get; set; }
        public string? Content { get; set; }
        public string Address { get; set; }
        public int? BeauticianId { get; set; }
        public int? EventRMId { get; set; }
    }
}
