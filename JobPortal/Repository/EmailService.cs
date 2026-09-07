using JobPortal.Models;
using System.Net;
using System.Net.Mail;

namespace JobPortal.Repository
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmployeeReviewEmailAsync(ContactViewModel model, string senderBrowser)
        {
            var settings = _config.GetSection("MySettings");

            using (var message = new MailMessage())
            {
                string adminEmail = settings["SenderEmail"];

                // Sender Info
                message.From = new MailAddress(settings["SenderEmail"], "EmployerNext Web Form");

                // Receivers
                message.To.Add(new MailAddress(model.Email));
                message.ReplyToList.Add(new MailAddress(model.Email));

                message.Subject = $"New Review Request: {model.FullName} from {model.Country}";

                message.Body = $@"
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;'>
            <h2 style='color: #2c3e50;'>New Form Submission</h2>
            <p>Following person has submitted a Employeer review request:</p>
            <hr>
            <p><b>--- User Provided Info ---</b></p>
            <ul>
                <li><b>Name:</b> {model.FullName}</li>
                <li><b>Email:</b> {model.Email}</li>
                <li><b>Phone:</b> {model.PhoneNumber}</li>
                <li><b>Job Title:</b> {model.CurrentJobTitle}</li>
            </ul>
            <p><b>--- System Tracked Info ---</b></p>
            <ul>
                <li><b>Exact Country:</b> {model.Country}</li>
                <li><b>Device/Browser:</b> {senderBrowser}</li>
                <li><b>Submitted At:</b> {DateTime.Now:f}</li>
            </ul>
        </div>";

                message.IsBodyHtml = true;

                // Attachment handling
                if (model.Resume != null && model.Resume.Length > 0)
                {
                    var stream = model.Resume.OpenReadStream();
                    message.Attachments.Add(new Attachment(stream, model.Resume.FileName));
                }

                using (var client = new SmtpClient(settings["SmtpServer"], int.Parse(settings["Port"])))
                {
                    client.Credentials = new NetworkCredential(settings["SenderEmail"], settings["AppPassword"]);
                    client.EnableSsl = true;
                    await client.SendMailAsync(message);
                }
            }
        }
    }
      
}
