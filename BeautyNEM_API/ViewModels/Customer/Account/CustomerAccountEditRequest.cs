using System.ComponentModel.DataAnnotations;
namespace BeautyNEM_API.ViewModels.Customer.Account
{
    public class CustomerAccountEditRequest
    {
        [Required]
        public string ID { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        [Required]
        public string Address { get; set; }
    }
}
