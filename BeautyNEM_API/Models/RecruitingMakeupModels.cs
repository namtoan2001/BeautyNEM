namespace BeautyNEM_API.Models
{
    public class RecruitingMakeupModels
    {
        public int Id { get; set; }
        public string? Price { get; set; }
        public string? Description { get; set; }
        public DateTime? Date { get; set; }
        public string? Name { get; set; }
        public int BeauticianId { get; set; }
        public virtual Beautician? Beautician { get; set; }
    }
}
