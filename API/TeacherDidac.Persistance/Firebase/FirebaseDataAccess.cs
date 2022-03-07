using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Text.Json;

namespace TeacherDidac.Persistance.Firebase
{
    public abstract class FirebaseDataAccess
    {
        protected FirestoreDb _db;

        public FirebaseDataAccess(IConfiguration config)
        {
            var firebaseSettings = JsonSerializer.Deserialize<FirebaseSettings>
                (File.ReadAllText(config["GOOGLE_APPLICATION_CREDENTIALS"]), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });

            _db = FirestoreDb.Create(firebaseSettings.Project_id);
        }
    }
}
