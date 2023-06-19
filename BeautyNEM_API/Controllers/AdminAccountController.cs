using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Administrator.Account;
using BeautyNEM_API.ViewModels.Administrator.Service;
using BeautyNEM_API.ViewModels.Administrator.Title;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAccountController : ControllerBase
    {
        private readonly IAdminAccountService _adminAccountService;
        public AdminAccountController(IAdminAccountService adminAccountService)
        {
            _adminAccountService = adminAccountService;

        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _adminAccountService.Login(request);
            if (result == null)
                return BadRequest("Login was unsuccessfully!");
            return Ok(result);
        }
        [HttpPost("AddService")]
        public async Task<IActionResult> AddService([FromForm] ServiceRequest request)
        {
            var result = await _adminAccountService.AddService(request);
            return Ok(result);
        }
        [HttpPut("UpdateService")]
        public async Task<IActionResult> UpdateService([FromForm] ServiceRequest request)
        {
            var result = _adminAccountService.UpdateService(request);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpDelete("DeleteService/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _adminAccountService.DeleteService(id);
            if (!result)
                return BadRequest("Delete was unsuccessfully!");
            return Ok(result);
        }
        [HttpGet("GetServiceList")]
        public IActionResult GetServiceList()
        {
            var result = _adminAccountService.GetServiceList();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetBeauticianStatisticals")]
        public IActionResult GetBeauticianStatisticals()
        {
            var result = _adminAccountService.GetBeauticianStatisticals();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetBeautyShopStatisticals")]
        public IActionResult GetBeautyShopStatisticals()
        {
            var result = _adminAccountService.GetBeautyShopStatisticals();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetCustomerStatisticals")]
        public IActionResult GetCustomerStatisticals()
        {
            var result = _adminAccountService.GetCustomerStatisticals();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetEventStatisticals")]
        public IActionResult GetEventStatisticals()
        {
            var result = _adminAccountService.GetEventStatisticals();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetTitle")]
        public IActionResult GetTitle()
        {
            var result = _adminAccountService.GetTitle();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPost("AddTitle")]
        public IActionResult AddTitle([FromForm] string titleName)
        {
            var result = _adminAccountService.AddTitle(titleName);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPut("UpdateTitle")]
        public IActionResult UpdateTitle([FromForm] Title request)
        {
            var result = _adminAccountService.UpdateTitle(request);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpDelete("DeleteTitle/{TitleId}")]
        public IActionResult DeleteTitle(int TitleId)
        {
            var result = _adminAccountService.DeleteTitle(TitleId);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPost("AddTitleImage")]
        public IActionResult AddTitleImage([FromForm] TitleImageRequest request)
        {
            var result = _adminAccountService.AddTitleImage(request);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetTitleImage")]
        public IActionResult GetTitleImage()
        {
            var result = _adminAccountService.GetTitleImage();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpDelete("DeleteTitleImage/{Id}")]
        public IActionResult DeleteTitleImage(int Id)
        {
            var result = _adminAccountService.DeleteTitleImage(Id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
    }
}
