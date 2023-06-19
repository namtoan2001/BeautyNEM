using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Token;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        public TokenController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpGet("GetTokenDevice")]
        public IActionResult GetTokenDevice([FromQuery] TokenVM tokenVM)
        {
            var result = _tokenService.GetTokenDevice(tokenVM);
            return Ok(result);
        }

        [HttpPut("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromForm] RefreshTokenRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _tokenService.RefreshToken(request);
            if (!result)
                return BadRequest("Refresh token was unsuccessfully!");
            return Ok(result);
        }
    }
}
