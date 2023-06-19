using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Customer.Notification;

namespace BeautyNEM_API.Interfaces
{
    public interface INotificationCustomerService
    {
        public List<NotificationCustomer> GetNotificationForCustomer(int customerId);
        public List<NotificationCustomerModelRecruit> GetNotificationRMForCustomer(int beauticianId);
        public Task<int> AddNotificationForCustomer(AddNotificationRequest request);
        public Task<int> AddNotificationRMForCustomer(AddNotificationRMRequest request);
        public Task<bool> UpdateReminderForCustomer(UpdateReminderRequest request);
        public Task<bool> UpdateReminderRMForCustomer(UpdateReminderRequest request);
    }
}
