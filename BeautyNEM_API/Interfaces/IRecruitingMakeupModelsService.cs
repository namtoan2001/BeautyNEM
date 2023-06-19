using BeautyNEM_API.ViewModels.Beautician.RecruitingMakeupModels;

namespace BeautyNEM_API.Interfaces
{
    public interface IRecruitingMakeupModelsService
    {
        public List<RecruitingMakeupModelsDetailsVM> GetListRecruitingMakeupModels();
        public RecruitingMakeupModelsDetailsVM GetRecruitingMakeupModelsDetailsWithId(int id);
        public List<RecruitingMakeupModelsImageVM> GetListRecruitingMakeupModelsImage(int id);
        public Task<bool> AddRecruitingMakeupModelsImage(RecruitingMakeupModelsImageVM request);
        public Task<bool> AddRecruitingMakeupModels(RecruitingMakeupModelsRequest request);
        public Task<bool> UpdateRecruitingMakeupModels(RecruitingMakeupModelsUpdateRequest request);
        public Task<bool> DeleteRecruitingMakeupModels(int id);
        public Task<bool> DeleteRecruitingMakeupModelsImage(int recruitingMakeupModelsId, string imageName);
    }
}
