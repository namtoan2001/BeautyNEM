using BeautyNEM_API.Interfaces;
using BeautyNEM_API.Models;
using BeautyNEM_API.ViewModels.Customer.Booking;
using BeautyNEM_API.ViewModels.Customer.Rating;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
namespace BeautyNEM_API.Services
{
    public class CustomerBookingService : ICustomerBookingService
    {
        private readonly BeautyNEMContext _context;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CustomerBookingService(BeautyNEMContext context, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
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

        public List<CustomerGetSkillVM> CustomerGetSkill(string id)
        {
            List<CustomerGetSkillVM> result = new List<CustomerGetSkillVM>();

            string[] idArr = id.Split(";");

            foreach (var idStr in idArr)
            {
                int idInt = Int32.Parse(idStr);

                var skill = _context.Skill.FirstOrDefault(x => x.Id == idInt);

                if (skill == null)
                    throw new Exception($"Cannot find skill with id {id}");


                var skillName = _context.Service.FirstOrDefault(x => x.Id == skill.ServiceId);

                if (skillName == null)
                    throw new Exception($"Cannot find skillName with id {skill.ServiceId}");

                var accountCustomer = new CustomerGetSkillVM
                {
                    id = skill.Id,
                    beauticianId = skill.BeauticianId,
                    serviceId = skill.ServiceId,
                    serviceName = skillName.Name,
                    price = skill.Price,
                    discount = skill.Discount,
                    time = skill.Time,
                };

                result.Add(accountCustomer);
            }

            return result;
        }

        public List<ScheduleVM> CustomerGetSchedule(int beauticianID, string dayName, string day)
        {

            string choosedDay = "";

            switch (dayName)
            {
                case "Monday":
                    choosedDay = "T2";
                    break;
                case "Tuesday":
                    choosedDay = "T3";
                    break;
                case "Wednesday":
                    choosedDay = "T4";
                    break;
                case "Thursday":
                    choosedDay = "T5";
                    break;
                case "Friday":
                    choosedDay = "T6";
                    break;
                case "Saturday":
                    choosedDay = "T7";
                    break;
                case "Sunday":
                    choosedDay = "CN";
                    break;
            }

            var schedules = _context.Schedule.Where(x => (";" + x.DaysOfWeek + ";").Contains(";" + choosedDay + ";") && x.Beautician.Id == beauticianID).ToList();

            var scheduleList = new List<ScheduleVM>();

            var splittedDateTime = day.Split('-');
            DateTime myDate = new DateTime(int.Parse(splittedDateTime[2]), int.Parse(splittedDateTime[1]), int.Parse(splittedDateTime[0]));


            foreach (var schedule in schedules)
            {
                var checkIsBooked = _context.Event.Where(x => (x.Beautician.Id == beauticianID) && x.EndTime == schedule.EndTime && x.StartTime == schedule.StartTime && x.DateEvent == myDate && x.EventStatus.Id != 1).FirstOrDefault();
                bool isBook;

                if (checkIsBooked != null)
                {
                    isBook = true;
                }
                else
                {
                    isBook = false;
                }

                scheduleList.Add(new ScheduleVM
                {
                    Id = schedule.Id,
                    DaysOfWeek = schedule.DaysOfWeek,
                    EndTime = schedule.EndTime,
                    StartTime = schedule.StartTime,
                    IsBooked = isBook
                });
            }

            return scheduleList;
        }


        public async Task<int> Booking(CustomerBookingRequest request)
        {
            var requestStartTime = TimeSpan.Parse(request.startTime);
            var requestEndTime = TimeSpan.Parse(request.endTime);

            var dateString = request.dateEvent.ToString("MM/dd/yyyy");

            DateTime parsedDate;
            try
            {
                parsedDate = DateTime.ParseExact(dateString, "MM/dd/yyyy", CultureInfo.InvariantCulture);
            }
            catch (FormatException)
            {
                throw new Exception("Ngày không hợp lệ. Vui lòng nhập theo định dạng MM/dd/yyyy.");
            }


            var checkSchedule = await _context.Event.FirstOrDefaultAsync(x => x.DateEvent == parsedDate && x.StartTime == requestStartTime && x.EndTime == requestEndTime && x.EventStatusId != 1);
            if (checkSchedule != null)
                throw new Exception("Lịch đã có người đặt!");

            if (request.dateEvent == null
                || request.startTime == null
                || request.endTime == null
                || request.customerId == 0
                || request.beauticianId == 0
                || request.Address == null
                || request.sumPrice == 0)
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            var customer = _context.Customer.FirstOrDefault(x => x.Id == request.customerId);
            if (customer == null)
                throw new Exception("Không tìm thấy khách hàng");

            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == request.beauticianId);
            if (beautician == null)
                throw new Exception("Không tìm thấy thợ làm đẹp");

            //Mặc định trạng thái mới đặt lịch là 1
            var eventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 1);
            if (eventStatus == null)
                throw new Exception("Không tìm thấy trạng thái");

            var booking = new Event()
            {
                DateEvent = parsedDate,
                StartTime = requestStartTime,
                EndTime = requestEndTime,
                Note = request.note,
                Customer = customer,
                Beautician = beautician,
                EventStatus = eventStatus,
                SumPrice = request.sumPrice,
                Address = request.Address
            };



            string[] idServices = request.idServices.Split(";");

            foreach (var idSer in idServices)
            {
                int idInt = Int32.Parse(idSer);
                var service = _context.Service.FirstOrDefault(x => x.Id == idInt);
                if (service == null)
                    throw new Exception("Không tìm thấy dịch vụ");

                var eventService = new EventService
                {
                    Event = booking,
                    Service = service,

                };
                _context.EventServices.Add(eventService);
            }

            _context.Event.Add(booking);
            await _context.SaveChangesAsync();
            return booking.Id;
        }

        public async Task<int> BookingRecruitModel(CustomerBookingModelRecruitmentRequest request)
        {

            if (
                request.ModelServiceId == 0
                || request.customerId == 0
                || request.beauticianId == 0
                || request.Address == null)
                throw new Exception("Vui lòng nhập đầy đủ thông tin!");

            var customer = _context.Customer.FirstOrDefault(x => x.Id == request.customerId);
            if (customer == null)
                throw new Exception("Không tìm thấy khách hàng");

            var beautician = _context.Beautician.FirstOrDefault(x => x.Id == request.beauticianId);
            if (beautician == null)
                throw new Exception("Không tìm thấy thợ làm đẹp");

            var recruitingMakeupModels = _context.RecruitingMakeupModels.FirstOrDefault(x => x.Id == request.ModelServiceId);
            if (recruitingMakeupModels == null)
                throw new Exception("Không tìm thấy bài đăng tuyển mẫu");



            //Mặc định trạng thái mới đặt lịch là 1
            var eventStatus = _context.EventStatus.FirstOrDefault(x => x.Id == 1);
            if (eventStatus == null)
                throw new Exception("Không tìm thấy trạng thái");

            var booking = new EventModelRecruit()
            {
                Note = request.note,
                Customer = customer,
                Beautician = beautician,
                EventStatus = eventStatus,
                RecruitingMakeupModels = recruitingMakeupModels,
                Address = request.Address,
            };


            _context.EventModelRecruit.Add(booking);
            await _context.SaveChangesAsync();
            return booking.Id;
        }

        public async Task<bool> BeauticianReview(BeauticianReviewRequest request)
        {
            var data = new Rating();
            data = new Rating()
            {
                StarNumber = request.StarNumber,
                Comment = request.Comment,
                BeauticianId = request.BeauticianId,
                CustomerId = request.CustomerId,
            };
            _context.Rating.Add(data);
            await _context.SaveChangesAsync();
            if (data.Id > 0)
            {
                string link = null;
                Account account = new Account(
                       "dpwifnuax",
                       "817342852663177",
                       "XHilYh4d2vklt733wnKRZxM-mag");

                Cloudinary cloudinary = new Cloudinary(account);
                cloudinary.Api.Secure = true;
                if (request.ImageFile != null)
                {
                    foreach (var item in request.ImageFile)
                    {
                        string imgName = new String(Path.GetFileNameWithoutExtension(item.FileName));
                        string img = new String(Path.GetFileNameWithoutExtension(item.FileName));
                        imgName = imgName + Path.GetExtension(item.FileName);
                        link = $"Review/BeauticianId_{data.BeauticianId}/{imgName}";
                        var dataimg = _context.Rating.FirstOrDefault(x => x.Id == data.Id);
                        dataimg.Image = imgName;
                        _context.Rating.Update(dataimg);
                        using (var ms = new MemoryStream())
                        {
                            item.CopyTo(ms);
                            System.Threading.Thread.Sleep(1000);
                            var filebytes = ms.ToArray();
                            Stream stream = new MemoryStream(filebytes);
                            string url = $"Review/BeauticianId_{data.BeauticianId}/{img}";
                            var uploadParams = new ImageUploadParams()
                            {
                                File = new FileDescription(img, stream),
                                PublicId = url,
                                Overwrite = true,
                            };
                            var uploadResult = cloudinary.Upload(uploadParams);
                        }
                    }
                }
                var evt = _context.Event.FirstOrDefault(x => x.Id == request.EventId);
                evt.RatingId = data.Id;
                _context.Event.Update(evt);
                return _context.SaveChanges() > 0;
            }
            return _context.SaveChanges() > 0;
        }
    }
}
