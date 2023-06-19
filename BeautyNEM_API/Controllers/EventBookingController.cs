using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventBookingController : ControllerBase
    {
        private readonly IEventBookingService _eventBookingService;
        public EventBookingController(IEventBookingService eventBookingService)
        {
            _eventBookingService = eventBookingService;
        }

        [HttpGet("GetEventsForBeautician")]
        public IActionResult GetEventsForBeautician()
        {
            var result = _eventBookingService.GetEventsForBeautician();
            return Ok(result); 
        }

        [HttpGet("GetEventsRMForBeautician")]
        public IActionResult GetEventsRMForBeautician()
        {
            var result = _eventBookingService.GetEventsRMForBeautician();
            return Ok(result);
        }
        [HttpGet("SearchFilterSortForBeautician")]
        public async Task<IActionResult> SearchFilterSortForBeautician([FromQuery] SearchFilterSortRequest request)
        {
            var result = await _eventBookingService.SearchFilterSortForBeautician(request);
            return Ok(result);
        }

        [HttpGet("GetEventsForCustomer")]
        public IActionResult GetEventsForCustomer()
        {
            var result = _eventBookingService.GetEventsForCustomer();
            return Ok(result);
        }

        [HttpGet("GetEventsRMForCustomer")]
        public IActionResult GetEventsRMForCustomer()
        {
            var result = _eventBookingService.GetEventsRMForCustomer();
            return Ok(result);
        }

        [HttpGet("SearchFilterSortForCustomer")]
        public async Task<IActionResult> SearchFilterSortForCustomer([FromQuery] SearchFilterSortRequest request)
        {
            var result = await _eventBookingService.SearchFilterSortForCustomer(request);
            return Ok(result);
        }

        [HttpGet("GetEventDetailById/{id}")]
        public IActionResult GetEventDetailById(int id)
        {
            var result = _eventBookingService.GetEventDetailById(id);
            return Ok(result);
        }

        [HttpGet("GetEventRMDetailById/{id}")]
        public IActionResult GetEventRMDetailById(int id)
        {
            var result = _eventBookingService.GetEventRMDetailById(id);
            return Ok(result);
        }

        [HttpPut("CompleteEventBooking/{Id}")]
        public async Task<IActionResult> CompleteEventBooking(int Id)
        {
            var result = await _eventBookingService.CompleteEventBooking(Id);
            if (!result)
                return BadRequest("Complete event was unsuccessfully!");
            return Ok(result);
        }

        [HttpPut("CompleteEventRMBooking/{Id}")]
        public async Task<IActionResult> CompleteEventRMBooking(int Id)
        {
            var result = await _eventBookingService.CompleteEventRMBooking(Id);
            if (!result)
                return BadRequest("Complete event was unsuccessfully!");
            return Ok(result);
        }

        [HttpDelete("CancelEventBooking/{Id}/{cancelReason}")]
        public async Task<IActionResult> CancelEventBooking(int Id, string cancelReason)
        {
            var result = await _eventBookingService.CancelEventBooking(Id, cancelReason);
            if (!result)
                return BadRequest("Cancel event was unsuccessfully!");
            return Ok(result);
        }

        [HttpDelete("CancelEventRMBooking/{Id}/{cancelReason}")]
        public async Task<IActionResult> CancelEventRMBooking(int Id, string cancelReason)
        {
            var result = await _eventBookingService.CancelEventRMBooking(Id, cancelReason);
            if (!result)
                return BadRequest("Cancel event was unsuccessfully!");
            return Ok(result);
        }

        [HttpPut("InProgressEventBooking/{Id}")]
        public async Task<IActionResult> InProgressEventBooking(int Id)
        {
            var result = await _eventBookingService.InProgressEventBooking(Id);
            if (!result)
                return BadRequest("In Progress event was unsuccessfully!");
            return Ok(result);
        }

        [HttpPut("InProgressEventRMBooking/{Id}")]
        public async Task<IActionResult> InProgressEventRMBooking(int Id)
        {
            var result = await _eventBookingService.InProgressEventRMBooking(Id);
            if (!result)
                return BadRequest("In Progress event was unsuccessfully!");
            return Ok(result);
        }
    }
}
