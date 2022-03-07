using Microsoft.Extensions.DependencyInjection;
using System;

namespace TeacherDidac.Scheduler
{
    class Program
    {
        static void Main(string[] args)
        {
            var services = Startup.ConfigureServices();
            var serviceProvider = services.BuildServiceProvider();

            serviceProvider.GetService<Entrypoint>().Run(args);
        }
    }
}
