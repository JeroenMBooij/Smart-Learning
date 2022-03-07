using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Domain.Entities.Firebase
{
    [FirestoreData]
    public class PlayerCard
    {
        [FirestoreProperty("userId")]
        public string UserId { get; set; }

        [FirestoreProperty("deckId")]
        public string DeckId { get; set; }

        [FirestoreProperty("cardId")]
        public string CardId { get; set; }

        [FirestoreProperty("easeModifier")]
        public int EaseModifier { get; set; }

        [FirestoreProperty("state")]
        public string State { get; set; }

        [FirestoreProperty("currentInterval")]
        public int CurrentInterval { get; set; }

        [FirestoreProperty("intervalTime")]
        public string IntervalTime { get; set; }

        [FirestoreProperty("planning")]
        public string Planning { get; set; }
    }
}
