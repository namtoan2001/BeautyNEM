using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Customer.Notification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationCustomerController : ControllerBase
    {
        private readonly INotificationCustomerService _notificationService;
        public NotificationCustomerController(INotificationCustomerService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("GetNotificationForCustomer/{customerId}")]
        public IActionResult GetNotificationForCustomer(int customerId)
        {
            var result = _notificationService.GetNotificationForCustomer(customerId);
            return Ok(result);
        }

        [HttpGet("GetNotificationRMForCustomer/{customerId}")]
        public IActionResult GetNotificationRMForCustomer(int customerId)
        {
            var result = _notificationService.GetNotificationRMForCustomer(customerId);
            return Ok(result);
        }

        [HttpPost("AddNotificationForCustomer")]
        public async Task<IActionResult> AddNotificationForCustomer([FromForm] AddNotificationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.AddNotificationForCustomer(request);
            if (result == 0)
                return BadRequest("Add Notification was unsuccessfully!");
            return Ok(result);
        }
        [HttpPost("AddNotificationRMForCustomer")]
        public async Task<IActionResult> AddNotificationRMForCustomer([FromForm] AddNotificationRMRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.AddNotificationRMForCustomer(request);
            if (result == 0)
                return BadRequest("Add Notification was unsuccessfully!");
            return Ok(result);
        }

        [HttpPut("UpdateReminderForCustomer")]
        public async Task<IActionResult> UpdateReminderForCustomer([FromForm] UpdateReminderRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.UpdateReminderForCustomer(request);
            if (!result)
                return BadRequest("Update reminder request was unsuccessfully!");
            return Ok(result);
        }


        [HttpPut("UpdateReminderRMForCustomer")]
        public async Task<IActionResult> UpdateReminderRMForCustomer([FromForm] UpdateReminderRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _notificationService.UpdateReminderRMForCustomer(request);
            if (!result)
                return BadRequest("Update reminder request was unsuccessfully!");
            return Ok(result);
        }
    }
}
