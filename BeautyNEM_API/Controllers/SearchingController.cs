using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Beautician.Searching;
using BeautyNEM_API.ViewModels.BeautyShop.Searching;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchingController : ControllerBase
    {
        private readonly ISearchingService _searchingService;
        public SearchingController(ISearchingService searchingService)
        {
            _searchingService = searchingService;
        }

        [HttpGet("SearchFilter")]
        public async Task<IActionResult> SearchFilter([FromQuery] SearchFilterRequest request)
        {
            var result = await _searchingService.SearchFilter(request);
            return Ok(result);
        }

        [HttpGet("SearchFilterRecruits")]
        public async Task<IActionResult> SearchFilterRecruits([FromQuery] SearchRecruitModelRequest request)
        {
            var result = await _searchingService.SearchFilterRecruits(request);
            return Ok(result);
        }

        [HttpGet("SearchStore")]
        public async Task<IActionResult> SearchFilterBeautyShop([FromQuery] SearchBeautyShopRequest request)
        {
            var result = await _searchingService.SearchFilterBeautyShop(request);
            return Ok(result);
        }
    }
}
