using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace TeacherDidac.Logic
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddLogic(this IServiceCollection services, IConfiguration config)
        {
            services.Scan(scan => scan
                .FromAssemblyOf<ILogicAssembly>()
                .AddClasses(classes => classes.Where(type => type.Name.EndsWith("Manager")))
                .AsMatchingInterface()
                .WithScopedLifetime()
            );

            return services;
        }
    }

    public interface ILogicAssembly { }
}
