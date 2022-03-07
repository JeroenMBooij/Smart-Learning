using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System;
using System.Threading.Tasks;
using TeacherDidac.Persistance.Firebase;
using System.IO;

namespace TeacherDidac.Persistance
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistance(this IServiceCollection services, IConfiguration configuration)
        {
            #region Firebase
            var firebaseSettings = File.ReadAllText(configuration["GOOGLE_APPLICATION_CREDENTIALS"]);

            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromJson(firebaseSettings)
            });


            #region Repositories
            services.Scan(scan => scan
                .FromAssemblyOf<IPersistanceAssembly>()
                .AddClasses(classes => classes.Where(type => type.Name.EndsWith("Repository")))
                .AsMatchingInterface()
                .WithSingletonLifetime()
            );
            #endregion

            #region Observables
            services.Scan(scan => scan
                .FromAssemblyOf<IPersistanceAssembly>()
                .AddClasses(classes => classes.Where(type => type.Name.EndsWith("Observable")))
                .AsMatchingInterface()
                .WithSingletonLifetime()
            );
            #endregion

            #endregion

            return services;
        }
    }

    public interface IPersistanceAssembly
    {

    }
}
