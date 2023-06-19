namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class BeauticianWorkingTime
    {
        public int BeauticianId { get; set; }
        public int ServiceId { get; set; }
        public TimeSpan? Time { get; set; }
    }
}
