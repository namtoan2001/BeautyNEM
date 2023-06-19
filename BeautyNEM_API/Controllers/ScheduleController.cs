using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Beautician.Schedule;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpPost("CreateSchedule")]
        public async Task<IActionResult> CreateSchedule([FromForm] ScheduleCreatingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _scheduleService.CreateSchedule(request);
            if (result == 0)
                return BadRequest("Create schedule was unsuccessfully!");
            return Ok(result);
        }

        [HttpGet("GetSchedules")]
        public IActionResult GetSchedules()
        {
            var result = _scheduleService.GetSchedules();
            return Ok(result);
        }

        [HttpGet("SearchFilterSortSchedule")]
        public IActionResult SearchFilterSortSchedule([FromQuery] SearchFilterSortScheduleRequest request)
        {
            var result = _scheduleService.SearchFilterSortSchedule(request);
            return Ok(result);
        }

        [HttpGet("GetScheduleById/{Id}")]
        public IActionResult GetScheduleById(int Id)
        {
            var result = _scheduleService.GetScheduleById(Id);
            return Ok(result);
        }

        [HttpPut("EditSchedule")]
        public async Task<IActionResult> EditSchedule([FromForm] ScheduleEditingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _scheduleService.EditSchedule(request);
            if (!result)
                return BadRequest("Edit schedule was unsuccessfully!");
            return Ok(result);
        }

        [HttpDelete("DeleteSchedule/{Id}")]
        public async Task<IActionResult> DeleteSchedule(int Id)
        {
            var result = await _scheduleService.DeleteSchedule(Id);
            if (!result)
                return BadRequest("Delete schedule was unsuccessfully!");
            return Ok(result);
        }
    }
}
