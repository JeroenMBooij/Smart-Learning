using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using TeacherDidac.Application;
using TeacherDidac.Persistance;
using TeacherDidac.Scheduler.Firebase.Cards;

namespace TeacherDidac.Scheduler
{
    public class Startup
    {
        public static IServiceCollection ConfigureServices()
        {
            var services = new ServiceCollection();

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false);
            IConfiguration configuration = builder.Build();
            services.AddSingleton(configuration);

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();

            services.AddPersistance(configuration);

            services.AddLogging(builder =>
            {
                builder.AddConfiguration(configuration.GetSection("Logging"));
                builder.AddConsole();
                builder.AddSerilog();
            });

            services.AddSingleton<IFirebaseCardScheduler, FirebaseCardScheduler>();

            services.AddSingleton<Entrypoint>();

            return services;
        }
    }
}
