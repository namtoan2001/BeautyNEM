using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Notification;

namespace BeautyNEM_API.Interfaces
{
    public interface INotificationBeauticianService
    {
        public List<NotificationBeautician> GetNotificationForBeautician(int beauticianId);
        public List<NotificationBeauticianModelRecruit> GetNotificationRMForBeautician(int beauticianId);
        public Task<int> AddNotificationForBeautician(AddNotificationRequest request);
        public Task<int> AddNotificationRMForBeautician(AddNotificationRMRequest request);
        public Task<bool> ConfirmRequestForBeautician(ConfirmRequestVM request);
        public Task<bool> ConfirmRequestRMForBeautician(ConfirmRequestVM request);
    }
}
