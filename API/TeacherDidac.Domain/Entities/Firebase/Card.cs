using Google.Cloud.Firestore;
using System.Collections.Generic;
using TeacherDidac.Common.Constants;

namespace TeacherDidac.Domain.Entities.Firebase
{
    [FirestoreData]
    public class Card
    {
        public string Id { get; set; }

        [FirestoreProperty("deckId")]
        public string DeckId { get; set; }

        [FirestoreProperty("name")]
        public string Name { get; set; }

        [FirestoreProperty("type")]
        public string Type { get; set; }

        [FirestoreProperty("frontFrameSource")]
        public string FrontFrameSource { get; set; }

        [FirestoreProperty("backFrameSource")]
        public string BackFrameSource { get; set; }

        [FirestoreProperty("lastEditedBy")]
        public string LastEditedBy { get; set; }

        [FirestoreProperty("createdAt")]
        public string CreatedAt { get; set; }

        [FirestoreProperty("easeModifier")]
        public int EaseModifier { get; set; }

        [FirestoreProperty("frontHtml")]
        public string FrontHtml { get; set; }

        [FirestoreProperty("backHtml")]
        public string BackHtml { get; set; }

        [FirestoreProperty("css")]
        public string Css { get; set; }

        [FirestoreProperty("javascript")]
        public string Javascript { get; set; }

        [FirestoreProperty("steps")]
        public int[] Steps { get; set; }

        public List<CardMedia> Media { get; set; }

        public List<PlayerCard> PlayerCards { get; set; }
    }
}
