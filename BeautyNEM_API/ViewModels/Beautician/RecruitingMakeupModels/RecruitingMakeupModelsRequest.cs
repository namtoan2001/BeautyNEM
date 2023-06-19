using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Beautician.RecruitingMakeupModels
{
    public class RecruitingMakeupModelsRequest
    {
        public string Price { get; set; }
        public string Description { get; set; }
        public int BeauticianId { get; set; }
        public string Name { get; set; }
        [NotMapped]
        public IList<IFormFile> ImageFile { get; set; }
    }
}
