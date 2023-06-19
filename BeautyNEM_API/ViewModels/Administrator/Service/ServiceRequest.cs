using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Administrator.Service
{
    public class ServiceRequest
    {
        public int? Id { get; set; }
        public string? ServiceName { get; set; }
        public string? Icon { get; set; }
        [NotMapped]
        public IFormFile? IconFile { get; set; }
    }
}
