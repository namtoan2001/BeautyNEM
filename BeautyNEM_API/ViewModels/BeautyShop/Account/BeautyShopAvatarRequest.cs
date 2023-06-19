using System.ComponentModel.DataAnnotations.Schema;

namespace BeautyNEM_API.ViewModels.BeautyShop.Account
{
    public class BeautyShopAvatarRequest
    {
        public int BeautyShopId { get; set; }
        public string? AvatarName { get; set; }
        [NotMapped]
        public IList<IFormFile> AvtImgFile { get; set; }
    }
}
