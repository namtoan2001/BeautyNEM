namespace BeautyNEM_API.Models
{
    public class RecruitingMakeupModelsImage
    {
        public int Id { get; set; }
        public int RecruitingMakeupModelsId { get; set; }
        public string? Image { get; set; }
        public virtual RecruitingMakeupModels RecruitingMakeupModels { get; set; }
    }
}
