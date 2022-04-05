using AuthenticationServer.TenantPresentation.Services.GeneratedClients;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json.Linq;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace TeacherDidac.Web.Middleware.Auth
{
    public class CustomAuthAttribute : ActionFilterAttribute
    {
        public string Role;

        private readonly IAuthenticationClient _authClient;

        public CustomAuthAttribute(IAuthenticationClient authClient)
        {
            _authClient = authClient;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            string ticketString = context.HttpContext.Request.Headers["authorization"].ToString();
            if (string.IsNullOrEmpty(ticketString))
            {
                context.HttpContext.Response.StatusCode = 401;
                context.Result = new BadRequestObjectResult("Authorization token is empty");
                return;
            }

            Ticket ticket = JsonSerializer.Deserialize<Ticket>(ticketString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            try
            {
                await _authClient.TenantToken_ValidateTokenAsync(ticket.RegisteredJWT);
            }
            catch(Exception exception)
            {
                try
                {
                    ticket = await _authClient.TenantToken_RefreshTokenAsync(ticket);
                    // TODO return new ticket to client
                }
                catch(Exception error)
                {
                    context.HttpContext.Response.StatusCode = 401;
                    context.Result = new BadRequestObjectResult("Authorization token is invalid");
                    return;
                }
            }


            string dToken = await _authClient.TenantToken_DeserialzeTokenAsync(ticket.RegisteredJWT);
            string uid = JObject.Parse(dToken)["uid"].ToString();
            context.HttpContext.Request.Headers.Add("userid", uid);

            await next();

            base.OnActionExecuting(context);
        }
    }
}
