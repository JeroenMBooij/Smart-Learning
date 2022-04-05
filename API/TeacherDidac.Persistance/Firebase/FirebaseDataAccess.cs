using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace TeacherDidac.Persistance.Firebase
{
    public abstract class FirebaseDataAccess
    {
        protected static FirestoreDb _db;
        protected static WriteBatch _batch;
        protected static bool _commit;

        public FirebaseDataAccess(IConfiguration config)
        {
            if (_db is null)
            {
                var firebaseSettings = JsonSerializer.Deserialize<FirebaseSettings>
                    (File.ReadAllText(config["GOOGLE_APPLICATION_CREDENTIALS"]), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });

                _db = FirestoreDb.Create(firebaseSettings.Project_id);
                _commit = true;
            }
        }

        public static void StartTransaction(bool commit = false)
        {
            _batch = _db.StartBatch();
            _commit = commit;
        }

        public static void RollbackTransaction()
        {
            _commit = true;
        }

        public static async Task CommitTransaction()
        {
            await _batch.CommitAsync();
            _commit = true;
        }

        protected async Task<T> Transactional<T>(Func<Task<T>> action)
        {
            if (_commit)
                StartTransaction(true);

            var result = await action();

            if (_commit)
                await CommitTransaction();

            return result;
        }


    }
}
