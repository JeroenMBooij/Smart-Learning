using Hangfire;
using Hangfire.Dashboard;
using Hangfire.Dashboard.BasicAuthorization;
using Hangfire.MySql;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TeacherDidac.Persistance;
using TeacherDidac.Scheduler.Firebase.Cards;

namespace TeacherDidac.Scheduler
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string connectionString = GetDatabaseConnectionString(Configuration);
            services.AddDbContext<DbContext>(options =>
            {
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            });

            services.AddHangfire(x => x.UseStorage(new MySqlStorage(connectionString, new MySqlStorageOptions())));
            services.AddHangfireServer();

            services.AddLogging();
            services.AddPersistance(Configuration);
            services.AddSingleton <FirebaseCardScheduler>();

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                Authorization = new[]
                {
                    new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
                    {
                        RequireSsl = false,
                        SslRedirect = false,
                        LoginCaseSensitive = true,
                        Users = new []
                        {
                            new BasicAuthAuthorizationUser
                            {
                                Login = Configuration["HangfireUser"],
                                PasswordClear =  Configuration["HangfirePassword"]
                            }
                        }

                    })
                },
                IsReadOnlyFunc = (DashboardContext context) => Configuration["ASPNETCORE_ENVIRONMENT"] != "Development"
            });
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }


        private static string GetDatabaseConnectionString(IConfiguration configuration)
        {
            var dbHost = configuration["DB_HOST"];
            var dbName = configuration["DB_NAME"];
            var dbUser = configuration["DB_USER"];
            var dbPassword = configuration["DB_PASSWORD"];

            return $"server={dbHost}; database={dbName}; user={dbUser}; password={dbPassword}";
        }
    }
}
