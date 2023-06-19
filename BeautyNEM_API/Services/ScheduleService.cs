using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Schedule;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BeautyNEM_API.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ScheduleService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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

        public async Task<int> CreateSchedule(ScheduleCreatingRequest request)
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = await _context.Beautician.FirstOrDefaultAsync(x => x.Id == Int32.Parse(claimId.Value));
            _context.Beautician.ToList();

            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            if (request.StartTime == null
                || request.EndTime == null
                || request.DaysOfWeek == null)
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            var checkDaysOfWeek = request.DaysOfWeek.Split(";");
            if (checkDaysOfWeek.Length == 0)
                throw new Exception("Ngày trong tuần không hợp lệ!");

            var requestStartTime = TimeSpan.Parse(request.StartTime);
            var requestEndTime = TimeSpan.Parse(request.EndTime);

            foreach (var dayOfWeek in checkDaysOfWeek)
            {
                var checkTime = _context.Schedule.Any(x =>
                            ((x.StartTime <= requestStartTime && x.EndTime >= requestEndTime) ||
                            (x.StartTime >= requestStartTime && x.EndTime <= requestEndTime) ||
                            (x.StartTime <= requestStartTime && x.EndTime >= requestStartTime) ||
                            (x.StartTime <= requestEndTime && x.EndTime >= requestEndTime))
                            && x.DaysOfWeek.Contains(dayOfWeek)
                            && x.Beautician.Id == beautician.Id);
                if (checkTime)
                    throw new Exception("Thời gian này đã bị trùng vui lòng chọn lại!");
            }

            var schedule = new Schedule()
            {
                StartTime = requestStartTime,
                EndTime = requestEndTime,
                DaysOfWeek = request.DaysOfWeek,
                Beautician = beautician
            };
            _context.Schedule.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule.Id;
        }

        public List<Schedule> GetSchedules()
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            var schedules = _context.Schedule.Where(x => x.Beautician == beautician).ToList();
            return schedules;
        }

        public Schedule GetScheduleById(int Id)
        {
            var schedule = _context.Schedule.FirstOrDefault(x => x.Id == Id);
            if (schedule == null)
                throw new Exception($"Không tìm thấy lịch làm việc với ID {Id}");
            return schedule;
        }

        public async Task<bool> EditSchedule(ScheduleEditingRequest request)
        {
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            var schedule = await _context.Schedule.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (schedule == null)
                throw new Exception($"Không tìm thấy lịch làm việc với ID {request.Id}");

            var checkDaysOfWeek = request.DaysOfWeek.Split(";");
            if (checkDaysOfWeek.Length == 0)
                throw new Exception("Ngày trong tuần không hợp lệ!");

            var requestStartTime = TimeSpan.Parse(request.StartTime);
            var requestEndTime = TimeSpan.Parse(request.EndTime);

            foreach (var dayOfWeek in checkDaysOfWeek)
            {
                var checkTime = _context.Schedule.Any(x =>
                            x.Id != schedule.Id &&
                            ((x.StartTime <= requestStartTime && x.EndTime >= requestEndTime) ||
                            (x.StartTime >= requestStartTime && x.EndTime <= requestEndTime) ||
                            (x.StartTime <= requestStartTime && x.EndTime >= requestStartTime) ||
                            (x.StartTime <= requestEndTime && x.EndTime >= requestEndTime))
                            && x.DaysOfWeek.Contains(dayOfWeek)
                            && x.Beautician.Id == beautician.Id);
                if (checkTime)
                    throw new Exception("Thời gian này đã bị trùng vui lòng chọn lại!");
            }

            schedule.DaysOfWeek = request.DaysOfWeek;
            schedule.StartTime = requestStartTime;
            schedule.EndTime = requestEndTime;
            _context.Schedule.Update(schedule);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteSchedule(int Id)
        {
            var schedule = await _context.Schedule.FirstOrDefaultAsync(x => x.Id == Id);
            if (schedule == null)
                throw new Exception($"Không tìm thấy lịch làm việc với ID {Id}");

            _context.Schedule.Remove(schedule);
            return await _context.SaveChangesAsync() > 0;
        }

        public List<Schedule> SearchFilterSortSchedule(SearchFilterSortScheduleRequest request)
        {
            var listSchedule = new List<Schedule>();
            var claimId = GetJwtSecurityToken().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid);
            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == Int32.Parse(claimId.Value));
            if (beautician == null)
                throw new Exception($"Không tìm thấy thợ làm đẹp với ID {Int32.Parse(claimId.Value)}!");

            var schedules = _context.Schedule.Where(x => x.Beautician == beautician).ToList();

            //Filter day of week
            var listDaysOfWeek = new List<string>();
            if (request.DaysOfWeek != null)
                listDaysOfWeek = request.DaysOfWeek.Split(";").ToList();

            if(listDaysOfWeek.Count > 0)
            {
                foreach (var item in listDaysOfWeek)
                {
                    foreach (var schedule in schedules)
                    {
                        if(schedule.DaysOfWeek.Contains(item) && !listSchedule.Any(x => x.Id == schedule.Id))
                            listSchedule.Add(schedule);
                    }
                }
            }
            else {
                listSchedule = schedules;
            }

            //Filter time
            var timeFilterScheduleList = new List<Schedule>();
            if(request.StartTime != null && request.EndTime != null)
            {
                var requestStartTime = TimeSpan.Parse(request.StartTime);
                var requestEndTime = TimeSpan.Parse(request.EndTime);

                foreach (var item in listSchedule)
                {
                    if(((requestStartTime <= item.StartTime && requestEndTime >= item.EndTime) &&
                        (requestStartTime <= item.StartTime && requestEndTime >= item.StartTime) &&
                        (requestStartTime <= item.EndTime && requestEndTime >= item.EndTime)) &&
                        !timeFilterScheduleList.Any(x => x.Id == item.Id)) {
                        timeFilterScheduleList.Add(item);
                    }
                }
                listSchedule = timeFilterScheduleList;
            }

            return listSchedule;
        }
    }
}
