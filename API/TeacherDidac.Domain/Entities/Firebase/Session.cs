using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Domain.Entities.Firebase
{
    [FirestoreData]
    public class Session
    {
        public string Id { get; set; }

        [FirestoreProperty("userId")]
        public string UserId { get; set; }

        [FirestoreProperty("deckId")]
        public string DeckId { get; set; }

        [FirestoreProperty("startTime")]
        public Timestamp StartTime { get; set; }

        [FirestoreProperty("endTime")]
        public Timestamp EndTime { get; set; }
    }
}
