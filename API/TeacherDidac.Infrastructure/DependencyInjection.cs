using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeacherDidac.Application.Contracts.Infrastructure;
using TeacherDidac.Infrastructure.Transcribe;

namespace TeacherDidac.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient<ITranscribeClient, TranscribeClient>();

            return services;
        }
    }

    public interface IPersistanceAssembly
    {

    }
}
