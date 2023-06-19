using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Money;

namespace BeautyNEM_API.Interfaces
{
    public interface IMoneyService
    {
        public MoneyVM GetMoneyByMonth(int beauticianID, int month, int year);
        public MoneyVM GetMoneyByYear(int beauticianID, int year);


    }
}
