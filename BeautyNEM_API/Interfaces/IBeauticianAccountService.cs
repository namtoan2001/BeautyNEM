using BeautyNEM_API.ViewModels.Beautician.Account;
using BeautyNEM_API.Models;

namespace BeautyNEM_API.Interfaces
{
    public interface IBeauticianAccountService
    {
        public Task<AccountLoginVM> Login(AccountLoginRequest request);

        public Task<int> CreateAccount(AccountRegisterRequest request);

        public List<ServiceVM> GetServices();

        public List<CityVM> GetCities();

        public List<DistrictVM> GetDistricts(int CityID);
    }
}
