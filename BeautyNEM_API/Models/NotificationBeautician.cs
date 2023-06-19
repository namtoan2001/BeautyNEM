namespace BeautyNEM_API.Models
{
    public class NotificationBeautician
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime NotificationDate { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual Event? Event { get; set; }
    }
}
