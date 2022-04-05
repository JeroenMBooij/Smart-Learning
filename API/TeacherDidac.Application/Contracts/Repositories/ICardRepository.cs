using System.Threading.Tasks;
using TeacherDidac.Domain.Entities.Firebase;

namespace TeacherDidac.Application.Contracts.Repositories
{
    public interface ICardRepository
    {
        Task<Card> GetCardAsync(string deckId, string cardId);
        Task<PlayerCard> GetPlayerCardAsync(string deckId, string cardId, string userId);
        Task<PlayerCard> GetNextPlayerCardAsync(string deckId, string userId);
        Task<bool> UpdateCardFieldAsync(string deckId, string cardId, string field, object value);
        Task<bool> UpdatePlayerCardFieldAsync(string deckId, string cardId, string playerId, string field, object value);
        Task<bool> UpdatePlayerCardFieldAsync(PlayerCard playerCard, string field, object value);
        Task<bool> DeletePlayerCardFieldAsync(string deckId, string cardId, string playerId, string field);
        Task<bool> DeletePlayerCardFieldAsync(PlayerCard playerCard, string field);
    }
}