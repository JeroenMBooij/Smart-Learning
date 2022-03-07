using Google.Cloud.Firestore;

namespace TeacherDidac.Persistance.Firebase.Observables.Decks
{
    public interface ICardObservable
    {
        Query GetNewCards();
    }
}