using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Beautician.RecruitingMakeupModels
{
    public class RecruitingMakeupModelsImageVM
    {
        public int? Id { get; set; }
        public int RecruitingMakeupModelsId { get; set; }
        public string? ImageName { get; set; }
        [NotMapped]
        public IList<IFormFile> ImageFile { get; set; }
    }
}
