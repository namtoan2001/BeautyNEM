namespace BeautyNEM_API.ViewModels.Token
{
    public class RefreshTokenRequest
    {
        public int UserId { get; set; }
        public string Role { get; set; }
        public string TokenDevice { get; set; }
    }
}
