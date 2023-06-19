using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.BeautyShop.Account;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeautyShopController : ControllerBase
    {
        private readonly IBeautyShopService _beautyShopService;
        public BeautyShopController(IBeautyShopService beautyShopService)
        {
            _beautyShopService = beautyShopService;
        }
        [HttpGet("GetListBeautyShop")]
        public IActionResult GetListBeautyShop()
        {
            var result = _beautyShopService.GetListBeautyShop();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetBeautyShopWithId/{ShopId}")]
        public IActionResult GetBeautyShopDetailsWithId(int ShopId)
        {
            var result = _beautyShopService.GetBeautyShopDetailsWithId(ShopId);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetBeautyShopDetailsWithToken")]
        public IActionResult GetBeautyShopDetailsWithToken()
        {
            var result = _beautyShopService.GetBeautyShopDetailsWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetListBeautyShopImageWithToken")]
        public IActionResult GetListBeautyShopImageWithToken()
        {
            var result = _beautyShopService.GetListBeautyShopImageWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPut("UpdateBeautyShop")]
        public async Task<IActionResult> UpdateBeautyShop([FromForm] BeautyShopRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beautyShopService.UpdateBeautyShop(request);
            if (!result)
                return BadRequest("Update was unsuccessfully!");
            return Ok(result);
        }
        [HttpPut("UpdatePasswordBeautyShop")]
        public async Task<IActionResult> UpdatePasswordBeautyShop([FromForm] BeautyShopPasswordRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beautyShopService.UpdatePasswordBeautyShop(request);
            if (!result)
                return BadRequest("Update was unsuccessfully!");
            return Ok(result);
        }
        [HttpPut("UpdateAvatarBeautyShop")]
        public async Task<IActionResult> UpdateAvatarBeautyShop([FromForm] BeautyShopAvatarRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beautyShopService.UpdateAvatarBeautyShop(request);
            if (!result)
                return BadRequest("Update was unsuccessfully!");
            return Ok(result);
        }
        [HttpGet("GetListBeautyShopImageWithProductId/{BeautyShopId}/{ProductId}")]
        public IActionResult GetListBeautyShopImageWithProductId(int BeautyShopId, int ProductId)
        {
            var result = _beautyShopService.GetListBeautyShopImageWithProductId(BeautyShopId, ProductId);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }


    }
}
