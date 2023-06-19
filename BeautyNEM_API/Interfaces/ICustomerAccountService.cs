using BeautyNEM_API.ViewModels.Customer.Account;
using BeautyNEM_API.Models;

namespace BeautyNEM_API.Interfaces
{
    public interface ICustomerAccountService
    {
        public Task<AccountLoginVM> Login(AccountLoginRequest request);
        public Task<int> CreateAccount(CustomerAccountRegisterRequest request);

        public CustomerAccountVM GetCustomerByID(int CustomerID);

        public CustomerAccountVM GetCustomerProfile();
        public Task<bool> EditCustomerAccount(CustomerAccountEditRequest request);

        public Task<bool> ChangePassword(CustomerPasswordRequest request);

    }
}
