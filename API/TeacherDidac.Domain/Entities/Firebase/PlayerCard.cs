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
        public string Id { get; set; }

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

        [FirestoreProperty("phase")]
        public string Phase { get; set; }

        [FirestoreProperty("currentStepIndex")]
        public int CurrentStepIndex { get; set; }

        [FirestoreProperty("relearnInterval")]
        public int RelearnInterval { get; set; }

        [FirestoreProperty("planning")]
        public string Planning { get; set; }
    }
}
