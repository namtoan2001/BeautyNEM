namespace BeautyNEM_API.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int StarNumber { get; set; }
        public string Comment { get; set; }
        public string? Image { get; set; }
        public int BeauticianId { get; set; }
        public int CustomerId { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual Customer? Customer { get; set; }

    }
}
