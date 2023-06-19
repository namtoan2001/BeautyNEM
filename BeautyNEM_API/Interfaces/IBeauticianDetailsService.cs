using BeautyNEM_API.ViewModels.Beautician.BeauticianDetails;

namespace BeautyNEM_API.Interfaces
{
    public interface IBeauticianDetailsService
    {
        public BeauticianDetailsVM GetBeauticianDetailsWithToken();
        public List<BeauticianServiceVM> GetSkillWithToken();
        public List<BeauticianRatingVM> GetRatingWithToken();
        public List<BeauticianImageVM> GetImageWithToken();
        public BeauticianDetailsVM GetBeauticianDetails(int id);
        public List<BeauticianServiceVM> GetSkill(int id);
        public List<BeauticianRatingVM> GetRating(int id);
        public List<BeauticianImageVM> GetImage(int id);
        public List<BeauticianImageVM> GetImageWithServiceId(int beauticianId, int serviceId);
        public BeauticianAvatarVM GetAvatarWithToken();
        public Task<bool> UpdateBeauticianAvatar(BeauticianAvatarVM request);
        public Task<bool> UpdateBeauticianInfo(BeauticianInfomationRequest request);
        public Task<bool> UpdateBeauticianPassword(BeauticianPasswordRequest request);
        public Task<bool> AddImgBeautician(BeauticianImageVM request);
        public Task<bool> DeleteImgBeautician(int beauticianId, string imageLink);
        public Task<int> AddBeauticianService(BeauticianServiceRequest request);
        public Task<bool> UpdateBeauticianService(BeauticianServiceRequest request);
        public Task<bool> DeleteBeauticianService(int BeauticianId, int serviceId);
        public Task<bool> HandleDiscount(ServiceDiscountRequest request);
        public Task<bool> UpdateWorkingTime(BeauticianWorkingTime request);
    }
}
