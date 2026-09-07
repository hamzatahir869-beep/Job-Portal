using JobPortal.Models;

namespace JobPortal.Repository
{
    public interface IEmailService
    {
        Task SendEmployeeReviewEmailAsync(ContactViewModel model, string senderBrowser);
    }
}
