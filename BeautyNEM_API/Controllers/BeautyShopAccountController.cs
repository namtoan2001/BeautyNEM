using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.BeautyShop.Account;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeautyShopAccountController : ControllerBase
    {
        private readonly IBeautyShopAccountService _beautyShopAccountService;
        public BeautyShopAccountController(IBeautyShopAccountService beautyShopAccountService)
        {
            _beautyShopAccountService = beautyShopAccountService;
        }


        [HttpPost("CreateShopAccount")]
        public async Task<IActionResult> CreateAccount([FromForm] ShopAccountRegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beautyShopAccountService.CreateAccount(request);
            if (result == 0)
                return BadRequest("Register was unsuccessfully!");
            return Ok(result);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] AccountLoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beautyShopAccountService.Login(request);
            if (result == null)
                return BadRequest("Login was unsuccessfully!");
            return Ok(result);
        }
    }
}
