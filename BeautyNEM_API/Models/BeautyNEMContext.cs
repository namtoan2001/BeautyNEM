using Microsoft.EntityFrameworkCore;

namespace BeautyNEM_API.Models
{
    public class BeautyNEMContext : DbContext
    {
        public BeautyNEMContext()
        {

        }

        public BeautyNEMContext(DbContextOptions<BeautyNEMContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Beautician> Beautician { get; set; } = null!;
        public virtual DbSet<Customer> Customer { get; set; } = null!;
        public virtual DbSet<Rating> Rating { get; set; } = null!;
        public virtual DbSet<Skill> Skill { get; set; } = null!;
        public virtual DbSet<Service> Service { get; set; } = null!;
        public virtual DbSet<City> City { get; set; } = null!;
        public virtual DbSet<District> District { get; set; } = null!;
        public virtual DbSet<BeauticianImage> BeauticianImage { get; set; } = null!;
        public virtual DbSet<Event> Event { get; set; } = null!;
        public virtual DbSet<EventStatus> EventStatus { get; set; } = null!;
        public virtual DbSet<EventModelRecruit> EventModelRecruit { get; set; } = null!;
        public virtual DbSet<EventService> EventServices { get; set; } = null!;
        public virtual DbSet<Schedule> Schedule { get; set; } = null!;
        public virtual DbSet<RecruitingMakeupModels> RecruitingMakeupModels { get; set; } = null!;
        public virtual DbSet<RecruitingMakeupModelsImage> RecruitingMakeupModelsImage { get; set; } = null!;
        public virtual DbSet<Token> Token { get; set; } = null!;
        public virtual DbSet<NotificationBeautician> NotificationBeautician { get; set; } = null!;
        public virtual DbSet<NotificationBeauticianModelRecruit> NotificationBeauticianModelRecruit { get; set; } = null!;
        public virtual DbSet<NotificationCustomer> NotificationCustomer { get; set; } = null!;
        public virtual DbSet<NotificationCustomerModelRecruit> NotificationCustomerModelRecruit { get; set; } = null!;
        public virtual DbSet<Administrator> Administrator { get; set; } = null!;
        public virtual DbSet<BeautyShop> BeautyShop { get; set; } = null!;
        public virtual DbSet<BeautyShopImage> BeautyShopImage { get; set; } = null!;
        public virtual DbSet<Product> Product { get; set; } = null!;
        public virtual DbSet<Favorite> Favorite { get; set; } = null!;
        public virtual DbSet<Title> Title { get; set; } = null!;
        public virtual DbSet<TitleImage> TitleImage { get; set; } = null!;
    }
}
