namespace BeautyNEM_API.Models
{
    public class EventService
    {
        public int Id { get; set; }
        public virtual Event Event { get; set; }
        public virtual Service Service { get; set; }
    }
}
