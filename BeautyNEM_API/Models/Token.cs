namespace BeautyNEM_API.Models
{
    public class Token
    {
        public int Id { get; set; }
        public string TokenDevice { get; set; }
        public virtual Beautician? Beautician { get; set; }
        public virtual Customer? Customer { get; set; }
    }
}
