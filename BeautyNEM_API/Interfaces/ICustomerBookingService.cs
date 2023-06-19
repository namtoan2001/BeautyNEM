using BeautyNEM_API.ViewModels.Customer.Booking;
using BeautyNEM_API.ViewModels.Customer.Rating;

namespace BeautyNEM_API.Interfaces
{
    public interface ICustomerBookingService
    {

        public List<CustomerGetSkillVM> CustomerGetSkill(string id);
        public List<ScheduleVM> CustomerGetSchedule(int beauticianID, string dayName, string day);
        public Task<int> Booking(CustomerBookingRequest request);
        public Task<int> BookingRecruitModel(CustomerBookingModelRecruitmentRequest request);
        public Task<bool> BeauticianReview(BeauticianReviewRequest request);
    }
}
