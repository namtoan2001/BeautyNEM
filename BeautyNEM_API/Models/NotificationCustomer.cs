namespace BeautyNEM_API.Models
{
    public class NotificationCustomer
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime NotificationDate { get; set; }
        public bool IsReminded { get; set; }
        public virtual Customer? Customer { get; set; }
        public virtual Event? Event { get; set; }
    }
}
