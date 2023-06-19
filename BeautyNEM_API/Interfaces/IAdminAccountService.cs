using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Administrator.Account;
using BeautyNEM_API.ViewModels.Administrator.Service;
using BeautyNEM_API.ViewModels.Administrator.Statistical;
using BeautyNEM_API.ViewModels.Administrator.Title;

namespace BeautyNEM_API.Interfaces
{
    public interface IAdminAccountService
    {
        public Task<LoginVM> Login(LoginRequest request);
        public Task<bool> AddService(ServiceRequest request);
        public Task<bool> UpdateService(ServiceRequest request);
        public Task<bool> DeleteService(int id);
        public List<ServiceRequest> GetServiceList();
        public List<BeauticianStatisticals> GetBeauticianStatisticals();
        public List<BeautyShopStatisticals> GetBeautyShopStatisticals();
        public List<CustomerStatisticals> GetCustomerStatisticals();
        public List<EventStatisticals> GetEventStatisticals();
        public List<Title> GetTitle();
        public Task<bool> AddTitle(string titleName);
        public Task<bool> UpdateTitle(Title request);
        public Task<bool> DeleteTitle(int TitleId);
        public Task<bool> AddTitleImage(TitleImageRequest request);
        public List<TitleImage> GetTitleImage();
        public Task<bool> DeleteTitleImage(int Id);
    }
}
