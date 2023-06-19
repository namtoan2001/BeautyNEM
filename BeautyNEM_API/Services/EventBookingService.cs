using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.Shared;
using BeautyNEM_API.ViewModels.Shared;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class EventBookingService : IEventBookingService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ShareClass _shareClass;
        public EventBookingService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _shareClass = new ShareClass();
        }
        public JwtSecurityToken GetJwtSecurityToken()
        {
            string authHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Substring("Bearer ".Length).Trim();
            return _jwtService.DecodeJwt(token);
        }

        public List<Event> GetEventsForBeautician()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            var events = _context.Event.Where(x => x.Beautician.Id == beautician.Id).ToList();
            //Fetch data
            _context.Customer.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();

            return events;
        }

        public List<EventModelRecruit> GetEventsRMForBeautician()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            var events = _context.EventModelRecruit.Where(x => x.Beautician.Id == beautician.Id).OrderByDescending(x => x.Id).ToList();
            //Fetch data
            _context.Customer.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();

            return events;
        }

        public List<Event> GetEventsForCustomer()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var customer = _context.Customer.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {Int32.Parse(claimId.Value)}!");

            var events = _context.Event.Where(x => x.Customer.Id == customer.Id).OrderByDescending(x => x.DateEvent).ToList();
            //Fetch data
            _context.Beautician.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();

            return events;
        }

        public List<EventModelRecruit> GetEventsRMForCustomer()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var customer = _context.Customer.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {Int32.Parse(claimId.Value)}!");

            var events = _context.EventModelRecruit.Where(x => x.Customer.Id == customer.Id).OrderByDescending(x => x.Id).ToList();
            //Fetch data
            _context.Beautician.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();

            return events;
        }

        public Event GetEventDetailById(int id)
        {
            var eventBooking = _context.Event.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            //Fetch data
            _context.Beautician.ToList();
            _context.Customer.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();
            _context.Rating.ToList();
            return eventBooking;
        }

        public EventModelRecruit GetEventRMDetailById(int id)
        {
            var eventBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event recruit model với ID {id}");
            //Fetch data
            _context.Beautician.ToList();
            _context.Customer.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();
            _context.Rating.ToList();
            _context.RecruitingMakeupModels.ToList();
            return eventBooking;
        }

        public async Task<bool> CompleteEventBooking(int id)
        {
            var eventBooking = _context.Event.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 5);
            _context.Event.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CompleteEventRMBooking(int id)
        {
            var eventBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 5);
            _context.EventModelRecruit.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CancelEventBooking(int id, string cancelReason)
        {
            var eventBooking = _context.Event.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 6);
            eventBooking.CancelReason = cancelReason ?? "";
            _context.Event.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CancelEventRMBooking(int id, string cancelReason)
        {
            var eventBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 6);
            eventBooking.CancelReason = cancelReason ?? "";
            _context.EventModelRecruit.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> InProgressEventBooking(int id)
        {
            var eventBooking = _context.Event.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 4);
            _context.Event.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> InProgressEventRMBooking(int id)
        {
            var eventBooking = _context.EventModelRecruit.FirstOrDefault(x => x.Id == id);
            if (eventBooking == null)
                throw new Exception($"Không tìm thấy event với ID {id}");
            eventBooking.EventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 4);
            _context.EventModelRecruit.Update(eventBooking);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<List<Event>> SearchFilterSortForBeautician(SearchFilterSortRequest request)
        {
            var listEvent = new List<Event>();
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            //Fetch data
            _context.Beautician.ToList();
            _context.Customer.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();
            _context.Rating.ToList();

            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            var events = await _context.Event.OrderByDescending(x => x.DateEvent).Where(x => x.Beautician.Id == beautician.Id).ToListAsync();

            // Filter keyword
            var eventsKeywordFilter = new List<Event>();
            if (request.Keyword != null)
            {
                var keyword = _shareClass.convertToUnSign(request.Keyword).ToLower().Trim();
                foreach (var item in events)
                {
                    var fullName = _shareClass.convertToUnSign(item.Customer.FullName).ToLower().Trim();
                    if (fullName.Contains(keyword))
                        eventsKeywordFilter.Add(item);
                }
                listEvent = eventsKeywordFilter;
            }
            else
            {
                listEvent = events;
            }

            // Filter services
            var eventsServiceFilter = new List<Event>();
            var eventServiceList = new List<EventService>();
            var _eventServiceList = new List<EventService>();
            var listServiceIds = new List<string>();

            foreach (var item in listEvent)
            {
                if(_context.EventServices.Any(x => x.Event.Id == item.Id))
                {
                    var eventServiceHaving = _context.EventServices.Where(x => x.Event.Id == item.Id).ToList();
                    _eventServiceList.AddRange(eventServiceHaving);
                }
            }

            if (request.ServiceIds != null)
                listServiceIds = request.ServiceIds.Split(";").ToList();

            if (listServiceIds.Count > 0)
            {
                foreach (var serviceId in listServiceIds)
                {
                    foreach (var item in _eventServiceList)
                    {
                        if (item.Service.Id == Int32.Parse(serviceId))
                            eventServiceList.Add(item);
                    }
                }
                if (eventServiceList.Count > 0)
                {
                    foreach (var item in listEvent)
                    {
                        if(eventServiceList.Any(x => x.Event.Id == item.Id))
                            eventsServiceFilter.Add(item);
                    }
                }
                listEvent = eventsServiceFilter;
            }

            //Filter vote no empty
            var eventVotingList = new List<Event>();
            foreach (var item in listEvent)
            {
                if (item.Rating != null)
                {
                    eventVotingList.Add(item);
                }
            }
            //Filter vote empty
            var eventVotingEmptyList = new List<Event>();
            foreach (var item in listEvent)
            {
                if (item.Rating == null)
                {
                    eventVotingEmptyList.Add(item);
                }
            }

            switch (request.SortingId)
            {
                case 1:
                    var sortingDateDesc = listEvent.OrderByDescending(x => x.DateEvent).ToList();
                    return sortingDateDesc;
                
                case 2:
                    var sortingDateAsc = listEvent.OrderBy(x => x.DateEvent).ToList();
                    return sortingDateAsc;

                case 3:
                    var sortingVotingDesc = eventVotingList.OrderByDescending(x => x.Rating.StarNumber).ToList();
                    sortingVotingDesc.AddRange(eventVotingEmptyList);
                    return sortingVotingDesc;

                case 4:
                    var sortingVotingAsc = eventVotingList.OrderBy(x => x.Rating.StarNumber).ToList();
                    sortingVotingAsc.AddRange(eventVotingEmptyList);
                    return sortingVotingAsc;

                default:
                    var sortingDateByDefault = listEvent.OrderByDescending(x => x.DateEvent).ToList();
                    return sortingDateByDefault;
            }
        }

        public async Task<List<Event>> SearchFilterSortForCustomer(SearchFilterSortRequest request)
        {
            var listEvent = new List<Event>();
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            //Fetch data
            _context.Beautician.ToList();
            _context.Customer.ToList();
            _context.EventServices.ToList();
            _context.Service.ToList();
            _context.EventStatus.ToList();
            _context.Rating.ToList();

            var customer = _context.Customer.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (customer == null)
                throw new Exception($"Không tìm thấy khách hàng với ID {Int32.Parse(claimId.Value)}!");

            var events = await _context.Event.OrderByDescending(x => x.DateEvent).Where(x => x.Customer.Id == customer.Id).ToListAsync();

            // Filter keyword
            var eventsKeywordFilter = new List<Event>();
            if (request.Keyword != null)
            {
                var keyword = _shareClass.convertToUnSign(request.Keyword).ToLower().Trim();
                foreach (var item in events)
                {
                    var fullName = _shareClass.convertToUnSign(item.Beautician.FullName).ToLower().Trim();
                    if (fullName.Contains(keyword))
                        eventsKeywordFilter.Add(item);
                }
                listEvent = eventsKeywordFilter;
            }
            else
            {
                listEvent = events;
            }

            // Filter services
            var eventsServiceFilter = new List<Event>();
            var eventServiceList = new List<EventService>();
            var _eventServiceList = new List<EventService>();
            var listServiceIds = new List<string>();

            foreach (var item in listEvent)
            {
                if(_context.EventServices.Any(x => x.Event.Id == item.Id))
                {
                    var eventServiceHaving = _context.EventServices.Where(x => x.Event.Id == item.Id).ToList();
                    _eventServiceList.AddRange(eventServiceHaving);
                }
            }

            if (request.ServiceIds != null)
                listServiceIds = request.ServiceIds.Split(";").ToList();

            if (listServiceIds.Count > 0)
            {
                foreach (var serviceId in listServiceIds)
                {
                    foreach (var item in _eventServiceList)
                    {
                        if (item.Service.Id == Int32.Parse(serviceId))
                            eventServiceList.Add(item);
                    }
                }
                if (eventServiceList.Count > 0)
                {
                    foreach (var item in listEvent)
                    {
                        if(eventServiceList.Any(x => x.Event.Id == item.Id))
                            eventsServiceFilter.Add(item);
                    }
                }
                listEvent = eventsServiceFilter;
            }

            //Filter vote no empty
            var eventVotingList = new List<Event>();
            foreach (var item in listEvent)
            {
                if (item.Rating != null)
                {
                    eventVotingList.Add(item);
                }
            }
            //Filter vote empty
            var eventVotingEmptyList = new List<Event>();
            foreach (var item in listEvent)
            {
                if (item.Rating == null)
                {
                    eventVotingEmptyList.Add(item);
                }
            }

            switch (request.SortingId)
            {
                case 1:
                    var sortingDateDesc = listEvent.OrderByDescending(x => x.DateEvent).ToList();
                    return sortingDateDesc;
                
                case 2:
                    var sortingDateAsc = listEvent.OrderBy(x => x.DateEvent).ToList();
                    return sortingDateAsc;

                case 3:
                    var sortingVotingDesc = eventVotingList.OrderByDescending(x => x.Rating.StarNumber).ToList();
                    sortingVotingDesc.AddRange(eventVotingEmptyList);
                    return sortingVotingDesc;

                case 4:
                    var sortingVotingAsc = eventVotingList.OrderBy(x => x.Rating.StarNumber).ToList();
                    sortingVotingAsc.AddRange(eventVotingEmptyList);
                    return sortingVotingAsc;

                default:
                    var sortingDateByDefault = listEvent.OrderByDescending(x => x.DateEvent).ToList();
                    return sortingDateByDefault;
            }
        }
    }
}
