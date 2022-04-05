using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeacherDidac.Common.Enums;

namespace TeacherDidac.Domain.Entities.Firebase
{
    [FirestoreData]
    public class SessionCard
    {

        public string Id { get; set; }

        [FirestoreProperty("userId")]
        public string UserId { get; set; }

        [FirestoreProperty("cardId")]
        public string CardId { get; set; }

        [FirestoreProperty("feedback")]
        public FeedbackOptions Feedback { get; set; }

        [FirestoreProperty("isCorrect")]
        public bool IsCorrect { get; set; }

        [FirestoreProperty("startTime")]
        public Timestamp StartTime { get; set; }

        [FirestoreProperty("endTime")]
        public Timestamp? EndTime { get; set; }
    }
}
