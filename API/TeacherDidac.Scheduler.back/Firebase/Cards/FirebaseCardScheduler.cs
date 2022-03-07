using Google.Cloud.Firestore;
using System;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Common.Enums;
using TeacherDidac.Domain.Entities.Firebase;
using TeacherDidac.Persistance.Firebase.Observables.Decks;

namespace TeacherDidac.Scheduler.Firebase.Cards
{
    public class FirebaseCardScheduler : IFirebaseCardScheduler
    {
        private readonly ICardRepository _cardRepository;
        private readonly ICardObservable _deckObservable;

        public FirebaseCardScheduler(ICardRepository cardRepository, ICardObservable deckObservable)
        {
            _cardRepository = cardRepository;
            _deckObservable = deckObservable;
        }

        public async Task Init()
        {
            FirestoreChangeListener listener = _deckObservable.GetNewCards().Listen(snapshot =>
            {
                foreach (DocumentSnapshot documentSnapshot in snapshot.Documents)
                {
                    var card = documentSnapshot.ConvertTo<Card>();

                    // TODO Add card to Scheduler
                    Console.WriteLine($"Scheduling {documentSnapshot.Id}");


                    _cardRepository.UpdateCardField("SbEgaBqMagRiydhwDYou", documentSnapshot.Id, 
                        nameof(Card.State).ToLower(), EducationState.Sleeping);
                }
            });

            Console.WriteLine("Running card scheduler...");
            await listener.ListenerTask;
        }
    }
}
