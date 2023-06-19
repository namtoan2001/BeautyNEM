using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Beautician.BeauticianDetails;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeauticianDetailsController : ControllerBase
    {
        private readonly IBeauticianDetailsService _beauticianDetailsService;
        public BeauticianDetailsController(IBeauticianDetailsService beauticianDetailsService)
        {
            _beauticianDetailsService = beauticianDetailsService;
        }
        [HttpGet("GetBeauticianDetailsWithToken")]
        public IActionResult GetBeauticianDetails()
        {
            var result = _beauticianDetailsService.GetBeauticianDetailsWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetBeauticianDetails/{id}")]
        public IActionResult GetBeauticianDetails(int id)
        {
            var result = _beauticianDetailsService.GetBeauticianDetails(id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }

        [HttpGet("GetSkill/{id}")]
        public IActionResult GetSkill(int id)
        {
            var result = _beauticianDetailsService.GetSkill(id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetRating/{id}")]
        public IActionResult GetRating(int id)
        {
            var result = _beauticianDetailsService.GetRating(id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetImage/{id}")]
        public IActionResult GetImage(int id)
        {
            var result = _beauticianDetailsService.GetImage(id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetImageWithServiceId/{beauticianId}/{serviceId}")]
        public IActionResult GetImageWithServiceId(int beauticianId, int serviceId)
        {
            var result = _beauticianDetailsService.GetImageWithServiceId(beauticianId, serviceId);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPut("UpdateBeauticianInfo")]
        public async Task<IActionResult> UpdateBeauticianInfo([FromForm] BeauticianInfomationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beauticianDetailsService.UpdateBeauticianInfo(request);
            if (!result)
                return BadRequest("Edit was unsuccessfully!");
            return Ok(result);
        }
        [HttpDelete("DeleteImgBeautician/{beauticianId}/{imageLink}")]
        public async Task<IActionResult> DeleteImgBeautician(int beauticianId, string imageLink)
        {
            try
            {
                var result = await _beauticianDetailsService.DeleteImgBeautician(beauticianId, imageLink);
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
        [HttpPost("AddImgBeautician")]
        public async Task<IActionResult> AddImgBeautician([FromForm] BeauticianImageVM request)
        {
            var result = await _beauticianDetailsService.AddImgBeautician(request);

            return Ok(result);
        }
        [HttpPost("AddBeauticianService")]
        public async Task<IActionResult> AddBeauticianService([FromForm] BeauticianServiceRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _beauticianDetailsService.AddBeauticianService(request);
            if (result == 0)
            {
                return BadRequest("Add Service was unsuccessfully!");
            }
            return Ok(result);
        }
        [HttpPut("UpdateBeauticianService")]
        public async Task<IActionResult> UpdateBeauticianService([FromForm] BeauticianServiceRequest request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _beauticianDetailsService.UpdateBeauticianService(request);
            if (!result)
            {
                return BadRequest("Update Service was unsuccessfully!");
            }
            return Ok(result);
        }
        [HttpDelete("DeleteBeauticianService/{BeauticianId}/{serviceId}")]
        public async Task<IActionResult> DeleteBeauticianService(int BeauticianId, int serviceId)
        {
            try
            {
                var result = await _beauticianDetailsService.DeleteBeauticianService(BeauticianId, serviceId);
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
        [HttpPut("UpdatePasswordBeautician")]
        public async Task<IActionResult> ChangePassword([FromForm] BeauticianPasswordRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beauticianDetailsService.UpdateBeauticianPassword(request);
            if (!result)
                return BadRequest("Change password was unsuccessfully!");
            return Ok(result);
        }
        [HttpGet("GetSkillWithToken")]
        public IActionResult GetSkillWithToken()
        {
            var result = _beauticianDetailsService.GetSkillWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetRatingWithToken")]
        public IActionResult GetRatingWithToken()
        {
            var result = _beauticianDetailsService.GetRatingWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetImageWithToken")]
        public IActionResult GetImageWithToken()
        {
            var result = _beauticianDetailsService.GetImageWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetAvatarWithToken")]
        public IActionResult GetAvatarWithToken()
        {
            var result = _beauticianDetailsService.GetAvatarWithToken();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPut("UpdateBeauticianAvatar")]
        public async Task<IActionResult> UpdateBeauticianAvatar([FromForm] BeauticianAvatarVM request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _beauticianDetailsService.UpdateBeauticianAvatar(request);
            if (!result)
                return BadRequest("Change avatar was unsuccessfully!");
            return Ok(result);
        }
        [HttpPut("HandleDiscount")]
        public async Task<IActionResult> HandleDiscount([FromForm] ServiceDiscountRequest request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _beauticianDetailsService.HandleDiscount(request);
            if (!result)
            {
                return BadRequest("Update Discount was unsuccessfully!");
            }
            return Ok(result);
        }
        [HttpPut("UpdateWorkingTime")]
        public async Task<IActionResult> UpdateWorkingTime([FromForm] BeauticianWorkingTime request)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _beauticianDetailsService.UpdateWorkingTime(request);
            if (!result)
            {
                return BadRequest("Update was unsuccessfully!");
            }
            return Ok(result);
        }
    }
}
