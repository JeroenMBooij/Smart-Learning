using AuthenticationServer.TenantPresentation.Services.GeneratedClients;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json.Linq;
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
            string token = context.HttpContext.Request.Headers["authorization"].ToString();
            if (string.IsNullOrEmpty(token))
            {
                context.HttpContext.Response.StatusCode = 401;
                context.Result = new BadRequestObjectResult("Authorization token is empty");
                return;
            }

            bool valid = await _authClient.TenantToken_ValidateTokenAsync(token);
            if (valid == false)
            {
                context.HttpContext.Response.StatusCode = 401;
                context.Result = new BadRequestObjectResult("Authorization token is invalid");
                return;
            }

            string dToken = await _authClient.TenantToken_DeserialzeTokenAsync(token);
            string uid = JObject.Parse(dToken)["uid"].ToString();
            context.HttpContext.Request.Headers.Add("userid", uid);

            await next();

            base.OnActionExecuting(context);
        }
    }
}
