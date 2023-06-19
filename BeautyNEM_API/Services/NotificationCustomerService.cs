using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Customer.Notification;
using System.IdentityModel.Tokens.Jwt;

namespace BeautyNEM_API.Services
{
    public class NotificationCustomerService : INotificationCustomerService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public NotificationCustomerService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
        }

        public JwtSecurityToken GetJwtSecurityToken()
        {
            string authHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Substring("Bearer ".Length).Trim();
            return _jwtService.DecodeJwt(token);
        }

        public async Task<int> AddNotificationForCustomer(AddNotificationRequest request)
        {
            Customer customer = null;
            Event eventBooking = null;
            customer = _context.Customer.FirstOrDefault(x => x.Id == request.CustomerId);
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {customer.Id}!");

            if (_context.Event.Any(x => x.Id == request.EventId))
                eventBooking = _context.Event.FirstOrDefault(x => x.Id == request.EventId);

            var notification = new NotificationCustomer
            {
                Title = request.Title,
                Content = request.Content ?? "",
                NotificationDate = DateTime.Now,
                Customer = customer,
                Event = eventBooking
            };

            _context.NotificationCustomer.Add(notification);
            await _context.SaveChangesAsync();
            return notification.Id;
        }

        public async Task<int> AddNotificationRMForCustomer(AddNotificationRMRequest request)
        {
            Customer customer = null;
            EventModelRecruit eventRMBooking = null;
            customer = _context.Customer.FirstOrDefault(x => x.Id == request.CustomerId);
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {customer.Id}!");

            if (_context.EventModelRecruit.Any(x => x.Id == request.EventRMId))
                eventRMBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == request.EventRMId);

            var notification = new NotificationCustomerModelRecruit
            {
                Title = request.Title,
                Content = request.Content,
                NotificationDate = DateTime.Now,
                Customer = customer,
                EventModelRecruit = eventRMBooking,
                Address = request.Address
            };

            _context.NotificationCustomerModelRecruit.Add(notification);
            await _context.SaveChangesAsync();
            return notification.Id;
        }

        public List<NotificationCustomer> GetNotificationForCustomer(int customerId)
        {
            Customer customer = null;
            //Fetch data
            _context.Event.ToList();
            _context.EventStatus.ToList();
            customer = _context.Customer.FirstOrDefault(x => x.Id == customerId);
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {customer.Id}!");

            var notifications = _context.NotificationCustomer.Where(x => x.Customer.Id == customer.Id).OrderByDescending(x => x.Id).ToList();
            return notifications;
        }


        public List<NotificationCustomerModelRecruit> GetNotificationRMForCustomer(int beauticianId)
        {
            Customer customer = null;

            //Fetch data
            _context.EventModelRecruit.ToList();
            _context.EventStatus.ToList();



            customer = _context.Customer.FirstOrDefault(x => x.Id == beauticianId);
            if (customer == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {customer.Id}!");

            var notifications = _context.NotificationCustomerModelRecruit.Where(x => x.Customer.Id == customer.Id).OrderByDescending(x => x.Id).ToList();
            return notifications;
        }



        public async Task<bool> UpdateReminderForCustomer(UpdateReminderRequest request)
        {
            var notification = _context.NotificationCustomer.FirstOrDefault(x => x.Id == request.NotificationId);
            if (notification == null)
                throw new Exception($"Không tìm thấy thông báo của khách hàng với ID {request.NotificationId}!");

            notification.IsReminded = request.IsReminded;
            _context.NotificationCustomer.Update(notification);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateReminderRMForCustomer(UpdateReminderRequest request)
        {
            var notification = _context.NotificationCustomerModelRecruit.FirstOrDefault(x => x.Id == request.NotificationId);
            if (notification == null)
                throw new Exception($"Không tìm thấy thông báo của khách hàng với ID {request.NotificationId}!");

            notification.IsReminded = request.IsReminded;
            _context.NotificationCustomerModelRecruit.Update(notification);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
