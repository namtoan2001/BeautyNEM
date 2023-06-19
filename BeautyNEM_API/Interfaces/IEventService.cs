using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Shared;

namespace BeautyNEM_API.Interfaces
{
    public interface IEventBookingService
    {
        public List<Event> GetEventsForBeautician();
        public List<EventModelRecruit> GetEventsRMForBeautician();
        public List<EventModelRecruit> GetEventsRMForCustomer();
        public Task<List<Event>> SearchFilterSortForBeautician(SearchFilterSortRequest request);
        public List<Event> GetEventsForCustomer();
        public Task<List<Event>> SearchFilterSortForCustomer(SearchFilterSortRequest request);
        public Event GetEventDetailById(int id);
        public EventModelRecruit GetEventRMDetailById(int id);
        public Task<bool> CompleteEventBooking(int id);
        public Task<bool> CompleteEventRMBooking(int id);
        public Task<bool> InProgressEventBooking(int id);
        public Task<bool> InProgressEventRMBooking(int id);
        public Task<bool> CancelEventBooking(int id, string cancelReason);
        public Task<bool> CancelEventRMBooking(int id, string cancelReason);
    }
}
