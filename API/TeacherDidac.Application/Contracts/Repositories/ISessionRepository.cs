using System.Threading.Tasks;
using TeacherDidac.Application.Models;
using TeacherDidac.Common.Enums;
using TeacherDidac.Domain.Entities.Firebase;

namespace TeacherDidac.Application.Contracts.Repositories
{
    public interface ISessionRepository
    {
        Task EndAsync(string userId, string sessionId);
        Task EndCardAsync(string userId, string sessionId, string sessionCardId, bool? isCorrect = null);
        Task<Session> GetAsync(string userId, string id);
        Task<SessionCard> GetSessionCardAsync(string userId, string sessionId, string sessionCardId);
        Task<string> StartAsync(string userId, string deckId);
        Task<string> StartCardAsync(string userId, string sessionId, string cardId);
        Task SetCardInput(string sessionId, string sessionCardId, string userId, FeedbackOptions feedback);
    }
}