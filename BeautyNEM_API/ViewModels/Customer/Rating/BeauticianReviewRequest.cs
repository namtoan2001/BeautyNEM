using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Customer.Rating
{
    public class BeauticianReviewRequest
    {
        public int BeauticianId { get; set; }
        public int CustomerId { get; set; }
        public int EventId { get; set; }
        public int StarNumber { get; set; }
        public string Comment { get; set; }
        public string? ImageName { get; set; }
        [NotMapped]
        public IList<IFormFile>? ImageFile { get; set; }
    }
}
