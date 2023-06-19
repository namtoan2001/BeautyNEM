using BeautyNEM_API.ViewModels.Arrange;

namespace BeautyNEM_API.Interfaces
{
    public interface IArrangeService
    {
        public List<BeauticianInfo> SortBeauticianByRating();
        public List<ServiceInfo> SortBeauticianByDiscount();
    }
}
