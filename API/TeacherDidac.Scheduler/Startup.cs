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
using Polly;
using System;
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
            services.AddLogging();

            string connectionString = GetDatabaseConnectionString(Configuration);
            var retry = Policy.Handle<Exception>()
                           .WaitAndRetry(
                               retryCount: 10,
                               // 2,4,8,16,32 etc.
                               sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

            retry.Execute(() =>
            {
                services.AddDbContext<DbContext>(options =>
                {
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
                });
            });
            
            services.AddHangfire(x => x.UseStorage(new MySqlStorage(connectionString, new MySqlStorageOptions())));
            services.AddHangfireServer();

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
                                Login = Configuration["HANGFIRE_USER"],
                                PasswordClear =  Configuration["HANGFIRE_PASSWORD"]
                            }
                        }

                    })
                },
                IsReadOnlyFunc = (DashboardContext context) => Configuration["ASPNETCORE_ENVIRONMENT"] == "Production"
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

            return $"Server={dbHost}; Database={dbName}; Uid={dbUser}; Pwd={dbPassword}";
        }
    }
}
