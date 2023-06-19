namespace BeautyNEM_API.Models
{
    public class NotificationBeauticianModelRecruit
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Address { get; set; }
        public DateTime NotificationDate { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual EventModelRecruit? EventModelRecruit { get; set; }
    }
}
