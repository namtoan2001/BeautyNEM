using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Beautician.Account;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeauticianAccountController : ControllerBase
    {
        private readonly IBeauticianAccountService _beauticianAccountService;
        public BeauticianAccountController(IBeauticianAccountService beauticianAccountService)
        {
            _beauticianAccountService = beauticianAccountService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] AccountLoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beauticianAccountService.Login(request);
            if (result == null)
                return BadRequest("Login was unsuccessfully!");
            return Ok(result);
        }

        [HttpPost("CreateAccount")]
        public async Task<IActionResult> CreateAccount([FromForm] AccountRegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beauticianAccountService.CreateAccount(request);
            if (result == 0)
                return BadRequest("Register was unsuccessfully!");
            return Ok(result);
        }

        [HttpGet("GetCities")]
        public IActionResult GetCities()
        {
            var result = _beauticianAccountService.GetCities();
            if (result.Count == 0)
                return NotFound("Not Found!");
            return Ok(result);
        }

        [HttpGet("GetDistricts/{CityID}")]
        public IActionResult GetDistricts(int CityID)
        {
            var result = _beauticianAccountService.GetDistricts(CityID);
            if (result.Count == 0)
                return NotFound("Not Found!");
            return Ok(result);
        }

        [HttpGet("GetServices")]
        public IActionResult GetServices()
        {
            var result = _beauticianAccountService.GetServices();
            if (result.Count == 0)
                return NotFound("Not Found!");
            return Ok(result);
        }
    }
}
