using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Notification;
using System.IdentityModel.Tokens.Jwt;

namespace BeautyNEM_API.Services
{
    public class NotificationBeauticianService : INotificationBeauticianService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public NotificationBeauticianService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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

        public async Task<int> AddNotificationForBeautician(AddNotificationRequest request)
        {
            Beautician beautician = null;
            Event eventBooking = null;
            beautician = _context.Beautician.FirstOrDefault(x => x.Id == request.BeauticianId);
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {beautician.Id}!");

            if (_context.Event.Any(x => x.Id == request.EventId))
                eventBooking = _context.Event.FirstOrDefault(x => x.Id == request.EventId);

            if(request.Content == null)
                request.Content = eventBooking.Note != null ? eventBooking.Note : "";

            var notification = new NotificationBeautician
            {
                Title = request.Title,
                Content = request.Content,
                NotificationDate = DateTime.Now,
                Beautician = beautician,
                Event = eventBooking
            };

            _context.NotificationBeautician.Add(notification);
            await _context.SaveChangesAsync();
            return notification.Id;
        }

        public async Task<int> AddNotificationRMForBeautician(AddNotificationRMRequest request)
        {
            Beautician beautician = null;
            EventModelRecruit eventRMBooking = null;

            beautician = _context.Beautician.FirstOrDefault(x => x.Id == request.BeauticianId);
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {beautician.Id}!");

            if (_context.EventModelRecruit.Any(x => x.Id == request.EventRMId))
                eventRMBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == request.EventRMId);

            if (request.Content == null)
                request.Content = eventRMBooking.Note != null ? eventRMBooking.Note : "";

            var notification = new NotificationBeauticianModelRecruit
            {
                Title = request.Title,
                Content = request.Content,
                NotificationDate = DateTime.Now,
                Beautician = beautician,
                EventModelRecruit = eventRMBooking,
                Address = request.Address
            };

            _context.NotificationBeauticianModelRecruit.Add(notification);
            await _context.SaveChangesAsync();
            return notification.Id;
        }

        public List<NotificationBeautician> GetNotificationForBeautician(int beauticianId)
        {
            Beautician beautician = null;
            Customer customer = null;
            //Fetch data
            _context.Event.ToList();
            _context.EventStatus.ToList();
            beautician = _context.Beautician.FirstOrDefault(x => x.Id == beauticianId);
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {beautician.Id}!");

            var notifications = _context.NotificationBeautician.Where(x => x.Beautician.Id == beautician.Id).OrderByDescending(x => x.Id).ToList();
            return notifications;
        }

        public List<NotificationBeauticianModelRecruit> GetNotificationRMForBeautician(int beauticianId)
        {
            Beautician beautician = null;

            //Fetch data
            _context.EventModelRecruit.ToList();
            _context.EventStatus.ToList();
            


            beautician = _context.Beautician.FirstOrDefault(x => x.Id == beauticianId);
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {beautician.Id}!");

            var notifications = _context.NotificationBeauticianModelRecruit.Where(x => x.Beautician.Id == beautician.Id).OrderByDescending(x => x.Id).ToList();
            return notifications;
        }

        public async Task<bool> ConfirmRequestRMForBeautician(ConfirmRequestVM request)
        {
            var eventBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == request.EventId);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event tuyen mau  với ID {request.EventId}!");

            if (request.IsAccepted)
                eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 2);
            else
                eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 3);

            _context.EventModelRecruit.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ConfirmRequestForBeautician(ConfirmRequestVM request)
        {
            var eventBooking = _context.Event.FirstOrDefault(x => x.Id == request.EventId);
            if(eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {request.EventId}!");

            if (request.IsAccepted)
                eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 2);
            else
                eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 3);

            _context.Event.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
