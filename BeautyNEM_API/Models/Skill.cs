namespace BeautyNEM_API.Models
{
    public class Skill
    {
        public int Id { get; set; }
        public int BeauticianId { get; set; }
        public int ServiceId { get; set; }
        public int Price { get; set; }
        public int? Discount { get; set; }
        public TimeSpan? Time { get; set; }
        public virtual Beautician Beautician { get; set; }
        public virtual Service Service { get; set; }
    }
}
