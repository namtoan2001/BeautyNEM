namespace BeautyNEM_API.Models
{
    public class Event
    {
        public int Id { get; set; }
        public DateTime DateEvent { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string? Note { get; set; }
        public string? CancelReason { get; set; }
        public string? Address { get; set; }
        public int CustomerId { get; set; }
        public int BeauticianId { get; set; }
        public int EventStatusId { get; set; }
        public int? RatingId { get; set; }
        public virtual Rating? Rating { get; set; }
        public virtual Customer? Customer { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual List<EventService>? EventServices { get; set; }
        public virtual EventStatus? EventStatus { get; set; }
        public int? SumPrice { get; set; }
    }
}
