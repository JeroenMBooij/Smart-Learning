using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace TeacherDidac.Services
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration config)
        {
            services.Scan(scan => scan
                .FromAssemblyOf<IServiceAssembly>()
                .AddClasses(classes => classes.Where(type => type.Name.EndsWith("Service")))
                .AsMatchingInterface()
                .WithScopedLifetime()
            );

            return services;
        }
    }

    public interface IServiceAssembly { }
}
