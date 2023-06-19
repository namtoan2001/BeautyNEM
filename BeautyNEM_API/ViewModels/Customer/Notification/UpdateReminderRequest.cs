namespace BeautyNEM_API.ViewModels.Customer.Notification
{
    public class UpdateReminderRequest
    {
        public int NotificationId { get; set; }
        public bool IsReminded { get; set; }
    }
}
