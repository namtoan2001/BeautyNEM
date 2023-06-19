namespace BeautyNEM_API.ViewModels.Administrator.Statistical
{
    public class EventStatisticals
    {
        public int Id { get; set; }
        public DateTime DateEvent { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string? Note { get; set; }
        public string? Address { get; set; }
        public int CustomerId { get; set; }
        public int BeauticianId { get; set; }
        public int EventStatusId { get; set; }
        public string CustomerName { get; set; }
        public string BeauticianName { get; set; }
        public string EventStatusName { get; set; }
    }
}
