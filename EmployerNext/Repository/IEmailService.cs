using EmployerNext.Models;

namespace EmployerNext.Repository
{
    public interface IEmailService
    {
        Task SendEmployeeReviewEmailAsync(ContactViewModel model, string senderBrowser);
    }
}
