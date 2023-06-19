using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Money;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoneyController : ControllerBase
    {
        private readonly IMoneyService _moneyService;
        public MoneyController(IMoneyService moneyService)
        {
            _moneyService = moneyService;

        }
        [HttpGet("GetMoneyByMonth/{beauticianId}/{month}/{year}")]
        public IActionResult GetMoneyByMonth(int beauticianId, int month, int year)
        {
            var result = _moneyService.GetMoneyByMonth(beauticianId, month, year);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetMoneyByYear/{beauticianId}/{year}")]
        public IActionResult GetMoneyByYear(int beauticianId, int year)
        {
            var result = _moneyService.GetMoneyByYear(beauticianId, year);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }

    }
}
