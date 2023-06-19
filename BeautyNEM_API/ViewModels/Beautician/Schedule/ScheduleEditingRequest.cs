namespace BeautyNEM_API.ViewModels.Beautician.Schedule
{
    public class ScheduleEditingRequest
    {
        public int Id { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string DaysOfWeek { get; set; }
    }
}