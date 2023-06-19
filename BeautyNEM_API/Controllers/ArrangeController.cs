using BeautyNEM_API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArrangeController : ControllerBase
    {
        private readonly IArrangeService _ArrangeService;
        public ArrangeController(IArrangeService arrangeService)
        {
            _ArrangeService = arrangeService;
        }
        [HttpGet("SortBeauticianByRating")]
        public async Task<IActionResult> SortBeauticianByRating()
        {
            var result = _ArrangeService.SortBeauticianByRating();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("SortBeauticianByDiscount")]
        public async Task<IActionResult> SortBeauticianByDiscount()
        {
            var result = _ArrangeService.SortBeauticianByDiscount();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
    }
}
