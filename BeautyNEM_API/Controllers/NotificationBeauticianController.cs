using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Beautician.Notification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationBeauticianController : ControllerBase
    {
        private readonly INotificationBeauticianService _notificationService;
        public NotificationBeauticianController(INotificationBeauticianService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("GetNotificationForBeautician/{beauticianId}")]
        public IActionResult GetNotificationForBeautician(int beauticianId)
        {
            var result = _notificationService.GetNotificationForBeautician(beauticianId);
            return Ok(result);
        }

        [HttpGet("GetNotificationRMForBeautician/{beauticianId}")]
        public IActionResult GetNotificationRMForBeautician(int beauticianId)
        {
            var result = _notificationService.GetNotificationRMForBeautician(beauticianId);
            return Ok(result);
        }

        [HttpPost("AddNotificationForBeautician")]
        public async Task<IActionResult> AddNotificationForBeautician([FromForm] AddNotificationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.AddNotificationForBeautician(request);
            if (result == 0)
                return BadRequest("Add Notification was unsuccessfully!");
            return Ok(result);
        }

        [HttpPost("AddNotificationRMForBeautician")]
        public async Task<IActionResult> AddNotificationRMForBeautician([FromForm] AddNotificationRMRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.AddNotificationRMForBeautician(request);
            if (result == 0)
                return BadRequest("Add Notification was unsuccessfully!");
            return Ok(result);
        }

        [HttpPut("ConfirmRequestForBeautician")]
        public async Task<IActionResult> ConfirmRequestForBeautician([FromForm] ConfirmRequestVM request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.ConfirmRequestForBeautician(request);
            if (!result)
                return BadRequest("Confirm request was unsuccessfully!");
            return Ok(result);
        }

        [HttpPut("ConfirmRequestRMForBeautician")]
        public async Task<IActionResult> ConfirmRequestRMForBeautician([FromForm] ConfirmRequestVM request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.ConfirmRequestRMForBeautician(request);
            if (!result)
                return BadRequest("Confirm request was unsuccessfully!");
            return Ok(result);
        }
    }
}
