using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class BeauticianImageVM
    {
        public int? Id { get; set; }
        public int BeauticianId { get; set; }
        public string? ImageLink { get; set; }
        public int ServiceId { get; set; }
        [NotMapped]
        public IList<IFormFile> imgFile { get; set; }
    }
}
