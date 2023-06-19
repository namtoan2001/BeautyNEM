using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Customer.Rating;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpPost("AddRatingBeautician")]
        public async Task<IActionResult> AddRatingBeautician([FromForm] AddRatingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _ratingService.AddRatingBeautician(request);
            if (result == 0)
                return BadRequest("Add rating was unsuccessfully!");
            return Ok(result);
        }
    }
}
