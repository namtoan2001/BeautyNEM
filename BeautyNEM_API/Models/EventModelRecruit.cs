using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.Models
{
    public class EventModelRecruit
    {
        public int Id { get; set; }
        public string? Note { get; set; }
        public virtual RecruitingMakeupModels? RecruitingMakeupModels { get; set; }
        public virtual Customer? Customer { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual EventStatus? EventStatus { get; set; }
        public string? Address { get; set; }
        public string? CancelReason { get; set; }
    }
}
