using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Administrator.Title
{
    public class TitleImageRequest
    {
        [NotMapped]
        public List<IFormFile> ImageFile { get; set; }
    }
}
