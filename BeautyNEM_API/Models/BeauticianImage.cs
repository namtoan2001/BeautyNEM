namespace BeautyNEM_API.Models
{
    public class BeauticianImage
    {
        public int Id { get; set; }
        public int BeauticianId { get; set; }
        public string ImageLink { get; set; }
        public int ServiceId { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual Service? Service { get; set; }
    }
}
