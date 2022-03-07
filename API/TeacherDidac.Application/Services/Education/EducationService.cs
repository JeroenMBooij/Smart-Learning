using System;
using System.Linq;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Application.Models;
using TeacherDidac.Common.Constants;
using TeacherDidac.Domain.Entities.Firebase;

namespace TeacherDidac.Application.Services.Education
{
    public class EducationService : IEducationService
    {
        private readonly IDeckRepository _deckRepository;
        private readonly ICardRepository _cardRepository;

        public EducationService(IDeckRepository deckRepository, ICardRepository cardRepository)
        {
            _deckRepository = deckRepository;
            _cardRepository = cardRepository;
        }

        public async Task<FrontEducationCard> GetNextFrontCard(string deckId, string userId)
        {
            PlayerCard nextCard = await _cardRepository.GetNextPlayerCard(deckId, userId);
            if(nextCard == null)
                return null;

            Deck deck = await _deckRepository.GetDeck(deckId);
            Card card = await _cardRepository.GetCard(deckId, nextCard.CardId);

            return new FrontEducationCard()
            {
                CardId = nextCard.CardId,
                Content = card.FrontFrameSource,
                AnswerOptions = deck.AnswerOptions
            };
        }

        public async Task<BackEducationCard> SubmitCardAnswer(string deckId, string cardId, string userId)
        {
            Deck deck = await _deckRepository.GetDeck(deckId, false);

            Card card = await _cardRepository.GetCard(deckId, cardId);

            return new BackEducationCard()
            {
                CardId = card.Id,
                Content = card.BackFrameSource,
                FeedbackOption = deck.FeedbackOption
            };
        }

        public async Task<bool> SubmitCardFeedback(string deckId, string cardId, string userId, FeedbackData feedbackData)
        {
            Deck deck = await _deckRepository.GetDeck(deckId, false);
            Card card = await _cardRepository.GetCard(deckId, cardId);
            PlayerCard playerCard = await _cardRepository.GetPlayerCard(deckId, cardId, feedbackData.PlayerCardId);
            if (card == null)
                return false;


            /// https://www.youtube.com/watch?v=1XaJjbCSXT0
            /// default ease = 250%
            /// lowest ease = 130%
            /// good ease remains unchanged
            /// again substract 20% from ease
            /// hard subtract 15% from ease
            /// easy add 15% to ease
            /// easy bonus = 130%
            /// aim for 80-90% successrate for card
            int newInterval = playerCard.CurrentInterval * playerCard.EaseModifier * deck.IntervalModifier;

            return true;
        }
    }
}
