using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Beautician.Schedule;

namespace BeautyNEM_API.Interfaces
{
    public interface IScheduleService
    {
        public Task<int> CreateSchedule(ScheduleCreatingRequest request);
        public List<Schedule> GetSchedules();
        public List<Schedule> SearchFilterSortSchedule(SearchFilterSortScheduleRequest request);
        public Schedule GetScheduleById(int Id);
        public Task<bool> EditSchedule(ScheduleEditingRequest request);
        public Task<bool> DeleteSchedule(int Id);
    }
}
