using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Arrange;

namespace BeautyNEM_API.Services
{
    public class ArrangeService : IArrangeService
    {
        private readonly BeautyNEMContext _context;

        public ArrangeService(BeautyNEMContext context)
        {
            _context = context;
        }

        public List<ServiceInfo> SortBeauticianByDiscount()
        {
            var top4Beauticians = _context.Skill
                .Where(x => x.Discount.HasValue && x.Beautician != null)
                .OrderByDescending(x => x.Discount)
                .Take(4)
                .Join(
                    _context.BeauticianImage,
                    skill => new { skill.BeauticianId, skill.ServiceId },
                    image => new { image.BeauticianId, image.ServiceId },
                    (skill, image) => new ServiceInfo
                    {
                        BeauticianId = skill.BeauticianId,
                        ServiceId = skill.ServiceId,
                        BeauticianName = skill.Beautician.FullName,
                        ServiceName = skill.Service.Name,
                        Discount = skill.Discount,
                        Price = skill.Price
                    }).Distinct().ToList();

            return top4Beauticians;

        }

        public List<BeauticianInfo> SortBeauticianByRating()
        {
            var beauticians = _context.Beautician.ToList();
            var data = new List<BeauticianInfo>();

            foreach (var beautician in beauticians)
            {
                var ratings = _context.Rating.Where(x => x.BeauticianId == beautician.Id && x.StarNumber == 5);
                if (ratings.Any())
                {
                    data.Add(new BeauticianInfo
                    {
                        Id = beautician.Id,
                        FullName = beautician.FullName,
                        DistrictId = beautician.DistrictId,
                        BirthDate = beautician.BirthDate,
                        CityId = beautician.CityId,
                        PhoneNumber = beautician.PhoneNumber,
                        Avatar = beautician.Avatar,
                        StarNumber = beautician.StarNumber,
                    });
                }
            }

            var filteredData = data.GroupBy(b => b.Id).Select(g => g.First()).ToList();
            return filteredData;
        }
    }
}
