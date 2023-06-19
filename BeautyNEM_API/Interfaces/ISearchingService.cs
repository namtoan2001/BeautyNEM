using BeautyNEM_API.ViewModels.Beautician.Searching;
using BeautyNEM_API.ViewModels.BeautyShop.Searching;

namespace BeautyNEM_API.Interfaces
{
    public interface ISearchingService
    {
        public Task<List<SearchFilterVM>> SearchFilter(SearchFilterRequest request);

        public Task<List<SearchFilterRecruitModelVM>> SearchFilterRecruits(SearchRecruitModelRequest request);
        public Task<List<SearchBeautyShopFilterVM>> SearchFilterBeautyShop(SearchBeautyShopRequest request);
    }
}
