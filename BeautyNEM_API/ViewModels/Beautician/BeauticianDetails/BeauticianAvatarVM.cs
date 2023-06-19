using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.Beautician.BeauticianDetails
{
    public class BeauticianAvatarVM
    {
        public int BeauticianId { get; set; }
        public string? AvatarName { get; set; }
        [NotMapped]
        public IList<IFormFile> AvtImgFile { get; set; }
    }
}
