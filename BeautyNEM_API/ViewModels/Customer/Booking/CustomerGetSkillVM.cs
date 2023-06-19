namespace BeautyNEM_API.ViewModels.Customer.Booking
{
    public class CustomerGetSkillVM
    {
        public int id { get; set; }
        public int beauticianId { get; set; }
        public int serviceId { get; set; }
        public int price { get; set; }
        public int? discount { get; set; }
        public string serviceName { get; set; }
        public TimeSpan? time { get; set; }
    }
}
