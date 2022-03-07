using System.Threading.Tasks;
using TeacherDidac.Domain.Entities.Firebase;

namespace TeacherDidac.Application.Contracts.Repositories
{
    public interface ICardRepository
    {
        Task<Card> GetCard(string deckId, string cardId);
        Task<PlayerCard> GetPlayerCard(string deckId, string cardId, string playerCardId);
        Task<PlayerCard> GetNextPlayerCard(string deckId, string userId);
        Task<bool> UpdateCardField(string deckId, string cardId, string field, object value);
        Task<bool> UpdatePlayerCardField(string deckId, string cardId, string playerId, string field, object value);
    }
}