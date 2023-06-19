using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.Models
{
    public class Schedule
    {
        public int Id { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string DaysOfWeek { get; set; }
        public virtual Beautician? Beautician { get; set; }
    }
}
