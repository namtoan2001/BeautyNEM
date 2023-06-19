using BeautyNEM_API.ViewModels.BeautyShop.Account;

namespace BeautyNEM_API.Interfaces
{
    public interface IBeautyShopService
    {
        public List<BeautyShopVM> GetListBeautyShop();
        public BeautyShopDetailsVM GetBeautyShopDetailsWithToken();
        public BeautyShopDetailsVM GetBeautyShopDetailsWithId(int shopId);
        public List<BeautyShopImageVM> GetListBeautyShopImageWithToken();
        public Task<bool> UpdateBeautyShop(BeautyShopRequest request);
        public Task<bool> UpdatePasswordBeautyShop(BeautyShopPasswordRequest request);
        public Task<bool> UpdateAvatarBeautyShop(BeautyShopAvatarRequest request);
        public List<BeautyShopImageVM> GetListBeautyShopImageWithProductId(int BeautyShopId, int ProductId);
    }
}
