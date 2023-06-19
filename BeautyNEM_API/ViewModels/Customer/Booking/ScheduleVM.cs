namespace BeautyNEM_API.ViewModels.Customer.Booking
{
    public class ScheduleVM
    {
        public int Id { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string DaysOfWeek { get; set; }
        public bool IsBooked { get; set; }

    }
}
