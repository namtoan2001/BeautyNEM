using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Beautician.RecruitingMakeupModels;
using Microsoft.AspNetCore.Mvc;


namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecruitingMakeupModelsController : ControllerBase
    {
        private readonly IRecruitingMakeupModelsService _recruitingMakeupModelsService;
        public RecruitingMakeupModelsController(IRecruitingMakeupModelsService recruitingMakeupModelsService)
        {
            _recruitingMakeupModelsService = recruitingMakeupModelsService;
        }
        [HttpGet("GetRecruitingMakeupModelsList")]
        public IActionResult GetRecruitingMakeupModelsList()
        {
            var result = _recruitingMakeupModelsService.GetListRecruitingMakeupModels();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetRecruitingMakeupModelsDetailsWithId/{id}")]
        public IActionResult GetRecruitingMakeupModelsDetailsWithId(int id)
        {
            var result = _recruitingMakeupModelsService.GetRecruitingMakeupModelsDetailsWithId(id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpGet("GetListRecruitingMakeupModelsImage/{id}")]
        public IActionResult GetListRecruitingMakeupModelsImage(int id)
        {
            var result = _recruitingMakeupModelsService.GetListRecruitingMakeupModelsImage(id);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPost("AddRecruitingMakeupModels")]
        public async Task<IActionResult> AddRecruitingMakeupModels([FromForm] RecruitingMakeupModelsRequest request)
        {
            var result = await _recruitingMakeupModelsService.AddRecruitingMakeupModels(request);

            return Ok(result);
        }
        [HttpDelete("DeleteRecruitingMakeupModels/{id}")]
        public async Task<IActionResult> DeleteRecruitingMakeupModels(int id)
        {

            var result = await _recruitingMakeupModelsService.DeleteRecruitingMakeupModels(id);
            if (!result)
            {
                return BadRequest("Delete was unsuccessfully!");
            }
            return Ok(result);
        }
        [HttpDelete("DeleteRecruitingMakeupModelsImage/{recruitingMakeupModelsId}/{imageName}")]
        public async Task<IActionResult> DeleteRecruitingMakeupModelsImage(int recruitingMakeupModelsId, string imageName)
        {
            try
            {
                var result = await _recruitingMakeupModelsService.DeleteRecruitingMakeupModelsImage(recruitingMakeupModelsId, imageName);
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
        [HttpPost("AddRecruitingMakeupModelsImage")]
        public async Task<IActionResult> AddRecruitingMakeupModelsImage([FromForm] RecruitingMakeupModelsImageVM request)
        {
            var result = await _recruitingMakeupModelsService.AddRecruitingMakeupModelsImage(request);

            return Ok(result);
        }
        [HttpPut("UpdateRecruitingMakeupModels")]
        public async Task<IActionResult> UpdateRecruitingMakeupModels([FromForm] RecruitingMakeupModelsUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _recruitingMakeupModelsService.UpdateRecruitingMakeupModels(request);
            if (!result)
                return BadRequest("Update was unsuccessfully!");
            return Ok(result);
        }
    }
}
