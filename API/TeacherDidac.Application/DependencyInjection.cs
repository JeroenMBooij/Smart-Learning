using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TeacherDidac.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
        {

            #region Services
            services.Scan(scan => scan
                .FromAssemblyOf<IPersistanceAssembly>()
                .AddClasses(classes => classes.Where(type => type.Name.EndsWith("Service")))
                .AsMatchingInterface()
                .WithScopedLifetime()
            );
            #endregion

            return services;
        }
    }

    public interface IPersistanceAssembly
    {

    }
}
