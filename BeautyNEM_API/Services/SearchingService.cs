using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.Shared;
using BeautyNEM_API.ViewModels.Beautician.Searching;
using BeautyNEM_API.ViewModels.BeautyShop.Searching;
using Microsoft.EntityFrameworkCore;

namespace BeautyNEM_API.Services
{
    public class SearchingService : ISearchingService
    {
        private readonly BeautyNEMContext _context;
        private readonly ShareClass _shareClass;
        public SearchingService(BeautyNEMContext context)
        {
            _context = context;
            _shareClass = new ShareClass();
        }

        public async Task<List<SearchFilterVM>> SearchFilter(SearchFilterRequest request)
        {
            if (request.CityId == 0)
                throw new Exception("Vui lòng chọn khu vực bạn cần tìm kiếm!");

            var result = new List<SearchFilterVM>();
            var listBeauticians = new List<Beautician>();
            var beauticians = await _context.Beautician.OrderBy(x => x.FullName).Where(x => x.City.Id == request.CityId).ToListAsync();

            // Fetch data for beauticians
            _context.City.ToList();
            _context.District.ToList();
            _context.Skill.ToList();
            _context.Service.ToList();
            _context.Rating.ToList();
            // Filter price
            if (request.FromPrice >= request.ToPrice || request.ToPrice == 0)
                throw new Exception("Mức giá không hợp lệ!");
            var beauticiansPriceFilter = new List<Beautician>();
            foreach (var beautician in beauticians)
            {
                if (_context.Skill.Any(x => x.Beautician.Id == beautician.Id &&
                                         (x.Price >= request.FromPrice && x.Price <= request.ToPrice)))
                {
                    beauticiansPriceFilter.Add(beautician);
                }
            }
            listBeauticians = beauticiansPriceFilter;

            // Filter keyword
            var beauticiansKeywordFilter = new List<Beautician>();
            if (request.Keyword != null)
            {
                var keyword = _shareClass.convertToUnSign(request.Keyword).ToLower().Trim();
                foreach (var beautician in beauticians)
                {
                    var fullName = _shareClass.convertToUnSign(beautician.FullName).ToLower().Trim();
                    if (fullName.Contains(keyword))
                        beauticiansKeywordFilter.Add(beautician);
                }
                listBeauticians = beauticiansKeywordFilter;
            }
            else
            {
                beauticiansKeywordFilter = beauticiansPriceFilter;
            }

            // Filter districts
            var beauticiansDistrictFilter = new List<Beautician>();
            if (request.DistrictId != 0)
            {
                foreach (var beautician in beauticiansKeywordFilter)
                {
                    if (beautician.District.Id == request.DistrictId)
                        beauticiansDistrictFilter.Add(beautician);
                }
                listBeauticians = beauticiansDistrictFilter;
            }
            else
            {
                beauticiansDistrictFilter = beauticiansKeywordFilter;
            }

            // Filter services
            var beauticiansServiceFilter = new List<Beautician>();
            var services = new List<Service>();
            var listServiceIds = new List<string>();
            if (request.ServiceIds != null)
                listServiceIds = request.ServiceIds.Split(";").ToList();
            if (listServiceIds.Count > 0)
            {
                foreach (var serviceId in listServiceIds)
                {
                    if (_context.Service.Any(x => x.Id == Int32.Parse(serviceId)))
                        services.Add(_context.Service.FirstOrDefault(x => x.Id == Int32.Parse(serviceId)));
                }
                if (services.Count > 0)
                {
                    foreach (var beautician in beauticiansDistrictFilter)
                    {
                        foreach (var service in services)
                        {
                            if (_context.Skill.Any(x => x.Beautician.Id == beautician.Id && x.Service.Id == service.Id)
                                && !beauticiansServiceFilter.Any(x => x.Id == beautician.Id))
                                beauticiansServiceFilter.Add(beautician);
                        }
                    }
                    listBeauticians = beauticiansServiceFilter;
                }
            }
            else
            {
                beauticiansServiceFilter = beauticiansDistrictFilter;
            }

            // Filter rating
            var beauticiansRatingFilter = new List<Beautician>();
            if (request.StarNumber != 0)
            {
                foreach (var beautician in beauticiansServiceFilter)
                {
                    if (beautician.StarNumber >= request.StarNumber)
                        beauticiansRatingFilter.Add(beautician);
                }
                listBeauticians = beauticiansRatingFilter;
            }
            else
            {
                listBeauticians = beauticiansServiceFilter;
            }

            foreach (var beaucian in listBeauticians)
            {
                result.Add(new SearchFilterVM
                {
                    Id = beaucian.Id,
                    FullName = beaucian.FullName,
                    SkillName = beaucian.Skills[0].Service.Name,
                    CityName = beaucian.City.Name,
                    DistrictName = beaucian.District.Name,
                    StarNumber = beaucian.StarNumber,
                    Avatar = beaucian.Avatar
                });
            }

            return result;
        }

        public async Task<List<SearchFilterRecruitModelVM>> SearchFilterRecruits(SearchRecruitModelRequest request)
        {
            if (request.CityId == 0)
                throw new Exception("Vui lòng chọn khu vực bạn cần tìm kiếm!");

            var result = new List<SearchFilterRecruitModelVM>();

            var listRecruitposts = new List<RecruitingMakeupModels>();

            // Fetch data
            _context.Beautician.ToList();
            _context.City.ToList();
            _context.District.ToList();

            var recruitPosts = await _context.RecruitingMakeupModels.OrderBy(x => x.Name).Where(x => x.Beautician.CityId == request.CityId).ToListAsync();

            // Filter keyword
            var recruitPostKeywordFilter = new List<RecruitingMakeupModels>();
            if (request.Keyword != null)
            {
                var keyword = _shareClass.convertToUnSign(request.Keyword).ToLower().Trim();
                foreach (var post in recruitPosts)
                {
                    var Name = _shareClass.convertToUnSign(post.Name).ToLower().Trim();
                    if (Name.Contains(keyword))
                        recruitPostKeywordFilter.Add(post);
                }
                listRecruitposts = recruitPostKeywordFilter;
            }
            else
            {
                recruitPostKeywordFilter = recruitPosts;
            }

            // Filter districts
            var recruitPostDistrictFilter = new List<RecruitingMakeupModels>();
            if (request.DistrictId != 0)
            {
                foreach (var post in recruitPostKeywordFilter)
                {
                    if (post.Beautician.District.Id == request.DistrictId)
                        recruitPostDistrictFilter.Add(post);
                }
                listRecruitposts = recruitPostDistrictFilter;
            }
            else
            {
                recruitPostDistrictFilter = recruitPostKeywordFilter;
            }

            foreach (var post in listRecruitposts)
            {
                result.Add(new SearchFilterRecruitModelVM
                {
                    Id = post.Id,
                    PostName = post.Name,
                    CityName = post.Beautician.City.Name,
                    DistrictName = post.Beautician.District.Name,
                });
            }

            return result;
        }
        public async Task<List<SearchBeautyShopFilterVM>> SearchFilterBeautyShop(SearchBeautyShopRequest request)
        {
            if (request.CityId == 0)
                throw new Exception("Vui lòng chọn khu vực bạn cần tìm kiếm!");

            var result = new List<SearchBeautyShopFilterVM>();

            var listStore = new List<BeautyShop>();

            // Fetch data
            _context.BeautyShop.ToList();
            _context.City.ToList();
            _context.District.ToList();

            var stores = await _context.BeautyShop.OrderBy(x => x.StoreName).Where(x => x.CityId == request.CityId).ToListAsync();

            // Filter keyword
            var storeKeywordFilter = new List<BeautyShop>();
            if (request.Keyword != null)
            {
                var keyword = _shareClass.convertToUnSign(request.Keyword).ToLower().Trim();
                foreach (var store in stores)
                {
                    var Name = _shareClass.convertToUnSign(store.StoreName).ToLower().Trim();
                    if (Name.Contains(keyword))
                        storeKeywordFilter.Add(store);
                }
                listStore = storeKeywordFilter;
            }
            else
            {
                storeKeywordFilter = stores;
            }

            // Filter districts
            var storeDistrictFilter = new List<BeautyShop>();
            if (request.DistrictId != 0)
            {
                foreach (var store in storeKeywordFilter)
                {
                    if (store.DistrictId == request.DistrictId)
                        storeDistrictFilter.Add(store);
                }
                listStore = storeDistrictFilter;
            }
            else
            {
                storeDistrictFilter = storeKeywordFilter;
            }

            foreach (var store in listStore)
            {
                result.Add(new SearchBeautyShopFilterVM
                {
                    Id = store.Id,
                    StoreName = store.StoreName,
                    DistrictName = store.District.Name,
                    CityName = store.City.Name
                });
            }

            return result;
        }
    }
}
