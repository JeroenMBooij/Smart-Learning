using Google.Cloud.Firestore;
using Hangfire;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Common.Constants;
using TeacherDidac.Common.Extentions;
using TeacherDidac.Domain.Entities.Firebase;
using TeacherDidac.Persistance.Firebase.Observables.Decks;

namespace TeacherDidac.Scheduler.Firebase.Cards
{
    public class FirebaseCardScheduler
    {
        private readonly ICardRepository _cardRepository;
        private readonly ICardObservable _cardObservable;
        private readonly ILogger<FirebaseCardScheduler> _logger;

        public FirebaseCardScheduler(ICardRepository cardRepository, ICardObservable cardObservable, ILogger<FirebaseCardScheduler> logger)
        {
            _cardRepository = cardRepository;
            _cardObservable = cardObservable;
            _logger = logger;
        }

        public void Init()
        {
            _logger.LogInformation("Starting card scheduler");
            Task.Run(async () =>
            {
                while (true)
                {
                    FirestoreChangeListener listener = _cardObservable.GetNewCards().Listen(async snapshot =>
                    {
                        foreach (DocumentSnapshot documentSnapshot in snapshot.Documents)
                        {
                            try
                            {
                                var playerCard = documentSnapshot.ConvertTo<PlayerCard>();

                                _logger.LogInformation($"Scheduling {documentSnapshot.Id}");
                                ScheduleCard(documentSnapshot.Id, playerCard);

                                await _cardRepository.UpdatePlayerCardFieldAsync(playerCard.DeckId, playerCard.CardId, documentSnapshot.Id,
                                    nameof(PlayerCard.Planning).ToCamelCase(), PlanningState.Scheduled);
                            }
                            catch (Exception error)
                            {
                                _logger.LogError("Something really unexpected happend");
                                _logger.LogError(error.ToString());
                                
                                //TODO incase of corruption notify user
                                var playerCard = documentSnapshot.ConvertTo<PlayerCard>();

                                BackgroundJob.Schedule(() => ScheduleCard(documentSnapshot.Id, playerCard), TimeSpan.FromMinutes(1));
                            }
                        }
                    });

                    _logger.LogInformation("Running card scheduler...");
                    await listener.ListenerTask;
                    
                }
            });
        }

        public async Task ActivateCard(string playerCardId, PlayerCard playerCard)
        {
            bool result = await _cardRepository.UpdatePlayerCardFieldAsync(playerCard.DeckId, playerCard.CardId, playerCardId, nameof(playerCard.Planning).ToLower(), PlanningState.Due);
            if(result)
                _logger.LogInformation($"playercard {playerCardId} due; deckId: {playerCard.DeckId}; cardId: {playerCard.CardId}");
            else
                _logger.LogError($"Failed to activate card {playerCardId}");

        }

        private void ScheduleCard(string playerCardId, PlayerCard playerCard)
        {
            TimeSpan? interval = null;

            switch(playerCard.Phase)
            {
                case EducationPhase.Learning:
                    interval = TimeSpan.FromMinutes(playerCard.CurrentInterval);
                    break;

                case EducationPhase.Graduate:
                    interval = TimeSpan.FromDays(playerCard.CurrentInterval);
                    break;

                case EducationPhase.Relearn:
                    interval = TimeSpan.FromMinutes(playerCard.RelearnInterval);
                    break;

                default:
                    _logger.LogError($"Invalid phase: {playerCard.Phase} for playercard: {playerCardId} with deckId: {playerCard.DeckId} and cardId: {playerCard.CardId}");
                    break;
            }

            if (interval is not null)
                BackgroundJob.Schedule(() => ActivateCard(playerCardId, playerCard), interval.Value);
        }
    }
}
