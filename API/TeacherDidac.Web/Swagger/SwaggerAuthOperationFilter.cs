using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;
using TeacherDidac.Web.Middleware.Auth;

namespace TeacherDidac.Web.Swagger
{
    public class SwaggerAuthOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var authAttributes = context.MethodInfo.DeclaringType.GetCustomAttributes(true)
                .Union(context.MethodInfo.GetCustomAttributes(true))
                .OfType<ServiceFilterAttribute>();

            if (authAttributes.Any())
            {
                var securityRequirement = new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme()
                        {
                            Reference = new OpenApiReference()
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                };

                operation.Security = new List<OpenApiSecurityRequirement> { securityRequirement };
                operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthenticated" });
                operation.Responses.Add("403", new OpenApiResponse { Description = "Unauthorized" });
            }
        }


    }
}
