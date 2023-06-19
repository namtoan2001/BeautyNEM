namespace BeautyNEM_API.Models
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual List<District> Districts { get; set; }
    }
}
