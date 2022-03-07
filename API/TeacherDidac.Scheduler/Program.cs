using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TeacherDidac.Scheduler.Firebase.Cards;

namespace TeacherDidac.Scheduler
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args)
                .Build();

            using (var scope = host.Services.CreateScope())
            {
                var database = scope.ServiceProvider.GetService<DbContext>().Database;
                database.EnsureCreated();

                var firebaseCardScheduler = scope.ServiceProvider.GetService<FirebaseCardScheduler>();
                firebaseCardScheduler.Init();
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
