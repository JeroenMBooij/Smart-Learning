using System;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Application.Models;
using TeacherDidac.Common.Constants;
using TeacherDidac.Common.Enums;
using TeacherDidac.Common.Extentions;
using TeacherDidac.Domain.Entities.Firebase;

namespace TeacherDidac.Application.Services.Education
{
    public class EducationService : IEducationService
    {
        private readonly IDeckRepository _deckRepository;
        private readonly ICardRepository _cardRepository;
        private readonly ISessionRepository _sessionRepository;
        private readonly ITransactionRunner _transactionRunner;

        public EducationService(
            IDeckRepository deckRepository, 
            ICardRepository cardRepository,
            ISessionRepository sessionRepository,
            ITransactionRunner transactionRunner)
        {
            _deckRepository = deckRepository;
            _cardRepository = cardRepository;
            _sessionRepository = sessionRepository;
            _transactionRunner = transactionRunner;
        }

        public async Task<FrontEducationCard> GetNextFrontCardAsync(string sessionId, string userId)
        {
            Session session = await _sessionRepository.GetAsync(userId, sessionId);

            PlayerCard nextCard = await _cardRepository.GetNextPlayerCardAsync(session.DeckId, userId);
            if (nextCard == null)
                return null;

            Deck deck = await _deckRepository.GetDeck(session.DeckId);
            Card card = await _cardRepository.GetCardAsync(session.DeckId, nextCard.CardId);

            string sessionCardId = await _sessionRepository.StartCardAsync(userId, sessionId, nextCard.CardId);

            return new FrontEducationCard()
            {
                DeckId = session.DeckId,
                CardId = nextCard.CardId,
                PlayerCardId = nextCard.Id,
                SessionId = sessionId,
                SessionCardId = sessionCardId,
                Content = card.FrontFrameSource,
                AnswerOptions = deck.AnswerOptions
            };
        }

        public async Task<BackEducationCard> SubmitCardAnswerAsync(string sessionId, string sessionCardId, string userId)
        {
            Session session = await _sessionRepository.GetAsync(userId, sessionId);
            SessionCard sessionCard = await _sessionRepository.GetSessionCardAsync(userId, sessionId, sessionCardId);

            Deck deck = await _deckRepository.GetDeck(session.DeckId, false);

            Card card = await _cardRepository.GetCardAsync(session.DeckId, sessionCard.CardId);

            await _sessionRepository.EndCardAsync(userId, sessionId, sessionCardId);

            return new BackEducationCard()
            {
                DeckId = session.DeckId,
                CardId = card.Id,
                SessionId = sessionId,
                SessionCardId = sessionCardId,
                Content = card.BackFrameSource,
                FeedbackOption = deck.FeedbackOption
            };
        }

        public async Task<bool> SubmitCardFeedbackAsync(string sessionId, string sessionCardId, string userId, FeedbackOptions feedback)
        {
            Session session = await _sessionRepository.GetAsync(userId, sessionId);
            SessionCard sessionCard = await _sessionRepository.GetSessionCardAsync(userId, sessionId, sessionCardId);

            PlayerCard playerCard = await _cardRepository.GetPlayerCardAsync(session.DeckId, sessionCard.CardId, userId);
            if (playerCard == null)
                return false;

            _transactionRunner.Start();
            int newInterval;
            switch (playerCard.Phase)
            {
                case EducationPhase.Learning:
                    newInterval = await CalculateLearningInterval(playerCard);
                    break;

                case EducationPhase.Graduate:
                    newInterval = await CalculateGraduateInterval(playerCard, feedback);
                    break;

                case EducationPhase.Relearn:
                    newInterval = await CalculateRelearnInterval(playerCard, feedback);
                    break;

                default:
                    _transactionRunner.Rollback();
                    throw new Exception($"playercard phase: {playerCard.Phase} is invalid");
            }

            await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.CurrentInterval).ToCamelCase(), newInterval);
            await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.Planning).ToCamelCase(), PlanningState.UnScheduled);
            await _sessionRepository.SetCardInput(sessionId, sessionCardId, userId, feedback);

            await _transactionRunner.Commit();
            return true;
        }

        private async Task<int> CalculateRelearnInterval(PlayerCard playerCard, FeedbackOptions feedback)
        {
            if (feedback == FeedbackOptions.Good)
            {
                await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.Phase).ToCamelCase(), EducationPhase.Graduate);
                await _cardRepository.DeletePlayerCardFieldAsync(playerCard, nameof(PlayerCard.RelearnInterval));

                return (int)(playerCard.CurrentInterval * 0.7);
            }
            else
                return playerCard.CurrentInterval;
        }

        private async Task<int> CalculateLearningInterval(PlayerCard playerCard)
        {
            Deck deck = await _deckRepository.GetDeck(playerCard.DeckId, false);

            if (playerCard.CurrentStepIndex >= deck.LearningSteps.Length)
            {
                await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.Phase).ToCamelCase(), EducationPhase.Graduate);

                await _cardRepository.DeletePlayerCardFieldAsync(playerCard, nameof(PlayerCard.CurrentInterval).ToCamelCase());

                return 1;
            }

            var step = deck.LearningSteps[playerCard.CurrentStepIndex];

            await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.CurrentStepIndex).ToCamelCase(), playerCard.CurrentStepIndex++);

            return step;
        }


        /// <summary>
        /// https://www.youtube.com/watch?v=1XaJjbCSXT0
        /// </summary>
        /// <param name="playerCard"></param>
        /// <param name="feedbackData"></param>
        /// <returns></returns>
        private async Task<int> CalculateGraduateInterval(PlayerCard playerCard, FeedbackOptions feedback)
        {
            Deck deck = await _deckRepository.GetDeck(playerCard.DeckId, false);

            await UpdateEaseModifier(deck, playerCard, feedback);

            int newInterval;
            switch (feedback)
            {
                case FeedbackOptions.Again:
                    newInterval = (int)(playerCard.CurrentInterval * deck.EasePenalty.ToPercent());
                    await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.Phase).ToCamelCase(), EducationPhase.Relearn);
                    await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.RelearnInterval).ToCamelCase(), deck.LearningSteps[0]);
                    break;

                case FeedbackOptions.Hard:
                    newInterval = (int)(playerCard.CurrentInterval * (decimal)1.2 * deck.IntervalModifier);
                    break;

                case FeedbackOptions.Good:
                    newInterval = (int)(playerCard.CurrentInterval * playerCard.EaseModifier.ToPercent() * deck.IntervalModifier.ToPercent());
                    break;

                case FeedbackOptions.Easy:
                    newInterval = (int)(playerCard.CurrentInterval * playerCard.EaseModifier.ToPercent() * deck.IntervalModifier.ToPercent() * deck.EaseBonus.ToPercent());
                    break;

                default:
                    newInterval = playerCard.CurrentInterval;
                    break;
            }

            return newInterval;
        }

        private async Task UpdateEaseModifier(Deck deck, PlayerCard playerCard, FeedbackOptions feedback)
        {
            switch(feedback)
            {
                case FeedbackOptions.Again:
                    if (playerCard.EaseModifier != 130)
                        playerCard.EaseModifier = (int)(playerCard.EaseModifier * deck.Again.ToPercent());
                    break;

                case FeedbackOptions.Hard:
                    if (playerCard.EaseModifier != 130)
                        playerCard.EaseModifier = (int)(playerCard.EaseModifier * deck.Hard.ToPercent());
                    break;

                case FeedbackOptions.Good:
                    if (playerCard.EaseModifier != 130)
                        playerCard.EaseModifier = (int)(playerCard.EaseModifier * deck.Good.ToPercent());
                    return;

                case FeedbackOptions.Easy:
                    playerCard.EaseModifier = (int)(playerCard.EaseModifier * deck.Easy.ToPercent());
                    break;

                default:
                    return;
            }

            if (playerCard.EaseModifier < 130)
                playerCard.EaseModifier = 130;

            await _cardRepository.UpdatePlayerCardFieldAsync(playerCard, nameof(PlayerCard.EaseModifier).ToCamelCase(), playerCard.EaseModifier);
        }

        public async Task<string> StartSession(string userId, string deckId)
        {
            Deck deck = await _deckRepository.GetDeck(deckId, false);
            if (deck is null)
                return null;
                
            return await _sessionRepository.StartAsync(userId, deckId);
        }

        public async Task EndSession(string userId, string sessionId)
        {
            await _sessionRepository.EndAsync(userId, sessionId);
        }
    }
}
