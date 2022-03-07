using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TeacherDidac.Persistance.Firebase
{
    public static class FirebaseExtensions
    {
        public static async Task<List<T>> IncludeAsync<T>(this DocumentReference docRef, string nestedCollection)
        {
            QuerySnapshot querySnapshot = await docRef.Collection(nestedCollection).GetSnapshotAsync();

            var documents = new List<T>();
            foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
            {
                T document = documentSnapshot.ConvertTo<T>();
                documents.Add(document);
            }

            return documents;
        }
    }
}
