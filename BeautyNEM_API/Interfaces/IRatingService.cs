using BeautyNEM_API.ViewModels.Customer.Rating;

namespace BeautyNEM_API.Interfaces
{
    public interface IRatingService
    {
        public Task<int> AddRatingBeautician(AddRatingRequest request);
    }
}
