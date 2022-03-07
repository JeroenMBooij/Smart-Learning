using AuthenticationServer.TenantPresentation.Services.GeneratedClients;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeacherDidac.Web.Middleware.Auth.MyAuthenticationServer
{
    public static class RegisterCustomAuthentication
    {
        public static IServiceCollection RegisterAuthentication(this IServiceCollection services, IConfiguration config)
        {
            services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(configuration =>
               configuration.BaseAddress = new Uri(config["AUTH_SERVER_URL"]));
            services.AddScoped<CustomAuthAttribute>();

            return services;
        }


    }
}
