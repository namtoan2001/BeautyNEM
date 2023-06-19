namespace BeautyNEM_API.Models
{
    public class Favorite
    {
        public int ID { get; set; }
        public int BeauticianId { get; set; }
        public int CustomerId { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual Customer? Customer { get; set; }
    }
}
