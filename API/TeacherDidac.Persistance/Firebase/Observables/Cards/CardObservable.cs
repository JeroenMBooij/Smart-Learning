using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;
using TeacherDidac.Common.Constants;
using TeacherDidac.Common.Extentions;
using TeacherDidac.Domain.Entities.Firebase;
using TeacherDidac.Persistance.Firebase.Constants;

namespace TeacherDidac.Persistance.Firebase.Observables.Decks
{
    public class CardObservable : FirebaseDataAccess, ICardObservable
    {
        public CardObservable(IConfiguration config) : base(config)
        {
        }

        public Query GetNewCards()
        {
            return _db.CollectionGroup(Collection.PlayerCards).WhereEqualTo(nameof(PlayerCard.Planning).ToCamelCase(), PlanningState.UnScheduled);
        }
    }
}
