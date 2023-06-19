using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Favorite;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }
        [HttpGet("GetFavoriteList")]
        public IActionResult GetFavoriteList()
        {
            var result = _favoriteService.GetFavoriteList();
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpPost("AddBeauticianToFavorite")]
        public async Task<IActionResult> AddBeauticianToFavorite([FromForm] FavoriteRequest request)
        {
            var result = _favoriteService.AddBeauticianToFavorite(request);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
        [HttpDelete("RemoveBeauticianToFavorite/{BeauticianId}/{CustomerId}")]
        public async Task<IActionResult> RemoveBeauticianToFavorite(int BeauticianId, int CustomerId)
        {
            var result = _favoriteService.RemoveBeauticianToFavorite(BeauticianId, CustomerId);
            if (result == null)
            {
                return NotFound("Not Found!");
            }
            return Ok(result);
        }
    }
}
