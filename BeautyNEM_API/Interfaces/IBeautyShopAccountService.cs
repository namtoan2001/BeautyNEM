using BeautyNEM_API.ViewModels.BeautyShop.Account;
using BeautyNEM_API.Models;

namespace BeautyNEM_API.Interfaces
{
    public interface IBeautyShopAccountService
    {

        public Task<int> CreateAccount(ShopAccountRegisterRequest request);

        public Task<AccountLoginVM> Login(AccountLoginRequest request);
    }
}
