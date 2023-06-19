using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Customer.Booking;
using BeautyNEM_API.ViewModels.Customer.Rating;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerBookingController : ControllerBase
    {
        private readonly ICustomerBookingService _customerBookingService;
        public CustomerBookingController(ICustomerBookingService customerBookingService)
        {
            _customerBookingService = customerBookingService;
        }


        [HttpGet("CustomerGetSkill/{id}")]
        public IActionResult CustomerGetSkill(string id)
        {
            var result = _customerBookingService.CustomerGetSkill(id);
            if (result == null)
                return NotFound("Not Found!");
            return Ok(result);
        }

        [HttpGet("CustomerGetSchedule/{beauticianID}/{dayName}/{date}")]
        public IActionResult CustomerGetSchedule(int beauticianID, string dayName, string date)
        {
            var result = _customerBookingService.CustomerGetSchedule(beauticianID, dayName, date);
            if (result == null)
                return NotFound("Not Found!");
            return Ok(result);
        }

        [HttpPost("CustomerBooking")]
        public async Task<IActionResult> Booking([FromForm] CustomerBookingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _customerBookingService.Booking(request);

            if (result == 0)
                return BadRequest("Booking was unsuccessfully!");
            return Ok(result);
        }


        [HttpPost("CustomerBookingModelRecruit")]
        public async Task<IActionResult> BookingRecruitModel([FromForm] CustomerBookingModelRecruitmentRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _customerBookingService.BookingRecruitModel(request);

            if (result == 0)
                return BadRequest("Booking was unsuccessfully!");
            return Ok(result);
        }
        [HttpPost("BeauticianReview")]
        public async Task<IActionResult> BeauticianReview([FromForm] BeauticianReviewRequest request)
        {
            var result = await _customerBookingService.BeauticianReview(request);

            return Ok(result);
        }
    }
}
