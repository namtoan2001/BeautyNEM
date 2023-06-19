using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.BeautyShop.Products;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeautyShopProductController : ControllerBase
    {
        private readonly IBeautyShopProductService _beautyShopProductService;
        public BeautyShopProductController(IBeautyShopProductService beautyShopProductService)
        {
            _beautyShopProductService = beautyShopProductService;
        }


        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProduct([FromForm] ProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _beautyShopProductService.AddProduct(request);
            if (result == false)
                return BadRequest("Add product fail");
            return Ok(result);
        }
        [HttpPost("AddProductImage")]
        public async Task<IActionResult> AddProductImage([FromForm] ProductImageRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _beautyShopProductService.AddProductImage(request);
            if (result == false)
                return BadRequest("Add product Image fail");
            return Ok(result);
        }
        [HttpGet("GetProduct/{ShopId}")]
        public IActionResult GetShopProduct(int ShopId)
        {
            var result = _beautyShopProductService.GetShopProduct(ShopId);
            if (result.Count == 0)
                return NotFound("Not Found!");
            return Ok(result);
        }

        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateShopProduct([FromForm] ProductVM request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beautyShopProductService.UpdateShopProduct(request);
            if (!result)
                return BadRequest("Edit was unsuccessfully!");
            return Ok(result);
        }

        [HttpDelete("DeleteShopProduct/{ProductId}/{ShopId}")]
        public async Task<IActionResult> DeleteshopProduct(int ProductId, int ShopId)
        {
            try
            {
                var result = await _beautyShopProductService.DeleteshopProduct(ProductId, ShopId);
                if (!result)
                {
                    return BadRequest("Delete was unsuccessfully!");
                }
                return Ok(result);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database");
            }
        }
        [HttpDelete("DeleteBeautyShopImage/{BeautyShopId}/{productId}/{imageName}")]
        public async Task<IActionResult> DeleteshopProduct(int BeautyShopId, int productId, string imageName)
        {
            try
            {
                var result = await _beautyShopProductService.DeleteBeautyShopImage(BeautyShopId, productId, imageName);
                if (!result)
                {
                    return BadRequest("Delete was unsuccessfully!");
                }
                return Ok(result);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database");
            }
        }
    }
}
