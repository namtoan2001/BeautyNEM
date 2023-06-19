using BeautyNEM_API.Interfaces;
using BeautyNEM_API.ViewModels.Customer.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeautyNEM_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAccountController : ControllerBase
    {
        private readonly ICustomerAccountService _customerAccountService;
        public CustomerAccountController(ICustomerAccountService customerAccountService)
        {
            _customerAccountService = customerAccountService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] AccountLoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _customerAccountService.Login(request);
            if (result == null)
                return BadRequest("Login was unsuccessfully!");
            return Ok(result);
        }

        [HttpPost("CreateAccount")]
        public async Task<IActionResult> CreateAccount([FromForm] CustomerAccountRegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _customerAccountService.CreateAccount(request);
            if (result == 0)
                return BadRequest("Register was unsuccessfully!");
            return Ok(result);
        }

        [HttpGet("GetCustomerByID/{id}")]
        public IActionResult GetCustomerByID(int id)
        {
            var result =  _customerAccountService.GetCustomerByID(id);
            if (result == null)
                return NotFound("Not Found!");
            return Ok(result);
        }

        [HttpPut("EditCustomerAccount")]
        public async Task<IActionResult> EditCustomerAccount([FromForm] CustomerAccountEditRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _customerAccountService.EditCustomerAccount(request);
            if (!result)
                return BadRequest("Edit was unsuccessfully!");
            return Ok(result);
        }

        [HttpGet("GetCustomerProfile")]
        public IActionResult GetAccountProfile()
        {
            var result = _customerAccountService.GetCustomerProfile();
            if (result == null)
                return NotFound("Not Found!");
            return Ok(result);
        }


        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromForm] CustomerPasswordRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _customerAccountService.ChangePassword(request);
            if (!result)
                return BadRequest("Change password was unsuccessfully!");
            return Ok(result);
        }

    }
}
