using Google.Cloud.Firestore;
using System.Collections.Generic;

namespace TeacherDidac.Domain.Entities.Firebase
{
    [FirestoreData]
    public class Deck
    {
        public string Id { get; set; }

        [FirestoreProperty("teamId")]
        public string TeamId { get; set; }

        [FirestoreProperty("userId")]
        public string UserId { get; set; }

        [FirestoreProperty("selectedCategories")]
        public string[] SelectedCategories { get; set; }

        [FirestoreProperty("description")]
        public string Description { get; set; }

        [FirestoreProperty("answerOptions")]
        public string[] AnswerOptions { get; set; }

        [FirestoreProperty("feedbackOption")]
        public string FeedbackOption { get; set; }

        [FirestoreProperty("intervalModifier")]
        public int IntervalModifier { get; set; }

        [FirestoreProperty("defaultEaseModifier")]
        public int DefaultEaseModifier { get; set; }

        [FirestoreProperty("easeBonus")]
        public int EaseBonus { get; set; }

        [FirestoreProperty("easePenalty")]
        public int EasePenalty { get; set; }

        [FirestoreProperty("again")]
        public int Again { get; set; }

        [FirestoreProperty("hard")]
        public int Hard { get; set; }

        [FirestoreProperty("good")]
        public int Good { get; set; }

        [FirestoreProperty("easy")]
        public int Easy { get; set; }

        [FirestoreProperty("learningSteps")]
        public int[] LearningSteps { get; set; }

        public List<Card> Cards { get; set; }

        [FirestoreProperty("cardsDue")]
        public int CardsDue { get; set; }

        [FirestoreProperty("cardsDueTomorrow")]
        public int CardsDueTomorrow { get; set; }
    }
}
