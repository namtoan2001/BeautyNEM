using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Token;

namespace BeautyNEM_API.Interfaces
{
    public interface ITokenService
    {
        public string GetTokenDevice(TokenVM tokenVM);
        public Task<bool> RefreshToken(RefreshTokenRequest request);
    }
}
