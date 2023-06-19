using BeautyNEM_API.ViewModels.Favorite;

namespace BeautyNEM_API.Interfaces
{
    public interface IFavoriteService
    {
        public List<FavoriteList> GetFavoriteList();
        public Task<bool> AddBeauticianToFavorite(FavoriteRequest request);
        public Task<bool> RemoveBeauticianToFavorite(int BeauticianId, int CustomerId);
    }
}
