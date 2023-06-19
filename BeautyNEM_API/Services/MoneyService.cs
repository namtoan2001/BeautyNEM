using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Money;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class MoneySerivce : IMoneyService
    {
        private readonly BeautyNEMContext _context;
        public MoneySerivce(BeautyNEMContext context)
        {
            _context = context;
        }

        public MoneyVM GetMoneyByMonth(int beauticianID, int month, int year)
        {
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == beauticianID);
            if (beautician == null)
            {
                throw new Exception("Beautician not Found beautician");
            }
            var events = _context.Event.Where(x => x.BeauticianId == beauticianID && x.DateEvent.Month == month && x.DateEvent.Year == year && x.EventStatusId == 5).ToList();
            var sumPrice = events.Sum(x => x.SumPrice);

            var result = new MoneyVM
            {
                sumMoney = sumPrice,
                beauticianID = beauticianID,
                month = month,
                year = year
            };

            return result;

        }

        public MoneyVM GetMoneyByYear(int beauticianID, int year)
        {
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == beauticianID);
            if (beautician == null)
            {
                throw new Exception("Beautician not Found beautician");
            }
            var events = _context.Event.Where(x => x.BeauticianId == beauticianID && x.DateEvent.Year == year && x.EventStatusId == 5).ToList();
            var sumPrice = events.Sum(x => x.SumPrice);

            var result = new MoneyVM
            {
                sumMoney = sumPrice,
                beauticianID = beauticianID,
                year = year
            };

            return result;

        }
    }
}
