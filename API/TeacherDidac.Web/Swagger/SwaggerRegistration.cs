using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Reflection;

namespace TeacherDidac.Web.Swagger
{
    public static class SwaggerRegistration
    {
        public static IServiceCollection AddMySwagger(this IServiceCollection services)
        {

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Didac Api",
                    Description = $@"Smart and secure flash cards <br/> Authentication depends on <a href=""https://github.com/JeroenMBooij/JWT-SSO-Authentication""> the JWT SSO Authentication Server</a>",
                    Contact = new OpenApiContact
                    {
                        Name = "Jeroen Booij",
                        Email = "jmbooij.a@gmail.com",
                        Url = new Uri("https://twitter.com/Jeroen57971625"),
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Use under The MIT License",
                        Url = new Uri("https://opensource.org/licenses/MIT"),
                    }
                });
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));

                options.OperationFilter<SwaggerAuthOperationFilter>();

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "JWT Authorization",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

            });

            return services;
        }
    }
}
