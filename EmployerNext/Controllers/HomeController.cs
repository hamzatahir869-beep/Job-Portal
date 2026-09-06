using EmployerNext.Models;
using EmployerNext.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace EmployerNext.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        private readonly IEmailService _service;

        public HomeController(ILogger<HomeController> logger, IConfiguration config, IEmailService service)
        {
            _logger = logger;
            _config = config;
            _service = service;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReview(ContactViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new
                {
                    success = false,
                    message = "Validation failed. Please check your inputs."
                });
            }

            try
            {
                model.Country = await GetAutoCountry();
                string senderBrowser = Request.Headers["User-Agent"].ToString();

                var settings = _config.GetSection("MySettings");
                string smtpHost = settings["SmtpServer"];
                int smtpPort = int.Parse(settings["Port"]);
                string senderEmail = settings["SenderEmail"];
                string senderName = settings["SenderName"];
                string appPassword = settings["AppPassword"];

                var mimeMessage = new MimeKit.MimeMessage();

                mimeMessage.From.Add(new MimeKit.MailboxAddress(senderName, senderEmail));

              
                mimeMessage.To.Add(new MimeKit.MailboxAddress(model.FullName, model.Email));

                mimeMessage.ReplyTo.Add(new MimeKit.MailboxAddress(model.FullName, model.Email));

                // Subject
                mimeMessage.Subject = $"New Review Request: {model.FullName} from {model.Country}";

                var builder = new MimeKit.BodyBuilder();
                builder.HtmlBody = $@"
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;'>
            <h2 style='color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;'>New Form Submission</h2>
            <p>Following person has submitted an Employer review request:</p>
            <br>
            <p><b>--- User Provided Info ---</b></p>
            <ul style='list-style: none; padding-left: 0;'>
                <li><b>Name:</b> {model.FullName}</li>
                <li><b>Email:</b> {model.Email}</li>
                <li><b>Phone:</b> {model.PhoneNumber}</li>
                <li><b>Job Title:</b> {model.CurrentJobTitle}</li>
            </ul>
            <br>
            <p><b>--- System Tracked Info ---</b></p>
            <ul style='list-style: none; padding-left: 0;'>
                <li><b>Exact Country:</b> {model.Country}</li>
                <li><b>Device/Browser:</b> {senderBrowser}</li>
                <li><b>Submitted At:</b> {DateTime.Now:f}</li>
            </ul>
        </div>";

                if (model.Resume != null && model.Resume.Length > 0)
                {
                    using (var stream = model.Resume.OpenReadStream())
                    {
                        using (var ms = new MemoryStream())
                        {
                            await stream.CopyToAsync(ms);
                            builder.Attachments.Add(model.Resume.FileName, ms.ToArray());
                        }
                    }
                }

                mimeMessage.Body = builder.ToMessageBody();
                mimeMessage.Prepare(MimeKit.EncodingConstraint.None);

                using (var smtpClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    smtpClient.ServerCertificateValidationCallback = (s, cert, chain, sslPolicyErrors) => true;

                    await smtpClient.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);

                    await smtpClient.AuthenticateAsync(senderEmail, appPassword);

                    // Actual Send
                    await smtpClient.SendAsync(mimeMessage);

                    await smtpClient.DisconnectAsync(true);
                }

                return Json(new
                {
                    success = true,
                    message = "Thank you for choosing EmployerNext. Your details have been successfully submitted. Our team will reach out to you shortly to assist with your global Employer journey."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mail Error");

                return Json(new
                {
                    success = false,
                    message = "Error sending email: " + ex.Message
                });
            }
        }

        private async Task<string> GetAutoCountry()
        {
            try
            {
                string ip = null;

                // Try various headers for proxy/load balancer scenarios
                if (HttpContext.Request.Headers.ContainsKey("CF-Connecting-IP"))
                    ip = HttpContext.Request.Headers["CF-Connecting-IP"].ToString();
                else if (HttpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
                    ip = HttpContext.Request.Headers["X-Forwarded-For"].ToString().Split(',')[0].Trim();
                else if (HttpContext.Request.Headers.ContainsKey("X-Real-IP"))
                    ip = HttpContext.Request.Headers["X-Real-IP"].ToString();
                else
                    ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (string.IsNullOrEmpty(ip) || ip == "::1" || ip == "127.0.0.1")
                    return "Localhost";

                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(5);
                var response = await client.GetFromJsonAsync<System.Text.Json.JsonElement>($"http://ip-api.com/json/{ip}");

                if (response.ValueKind == System.Text.Json.JsonValueKind.Undefined ||
    response.ValueKind == System.Text.Json.JsonValueKind.Null)
                    return "Unknown";

                string status = response.GetProperty("status").GetString();
                if (status == "success")
                    return response.GetProperty("country").GetString();
                else
                    return "Unknown";
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to detect country from IP");
                return "Not Detected";
            }
        }
    }
}
