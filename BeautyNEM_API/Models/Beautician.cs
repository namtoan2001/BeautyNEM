namespace BeautyNEM_API.Models
{
    public class Beautician
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public double StarNumber { get; set; }
        public string? Avatar { get; set; }
        public virtual List<Skill>? Skills { get; set; }
        public virtual City? City { get; set; }
        public virtual District? District { get; set; }
    }
}
