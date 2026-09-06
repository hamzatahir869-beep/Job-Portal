namespace EmployerNext.Models
{
    public class ContactViewModel
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CurrentJobTitle { get; set; }
        public IFormFile? Resume { get; set; }
        public string? Country { get; set; }

    }
}
