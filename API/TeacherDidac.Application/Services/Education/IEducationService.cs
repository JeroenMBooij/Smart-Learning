using System.Threading.Tasks;
using TeacherDidac.Application.Models;
using TeacherDidac.Common.Enums;

namespace TeacherDidac.Application.Services.Education
{
    public interface IEducationService
    {
        Task<FrontEducationCard> GetNextFrontCardAsync(string sessionid, string userId);
        Task<BackEducationCard> SubmitCardAnswerAsync(string sessionId, string sessionCardId, string userId);
        Task<bool> SubmitCardFeedbackAsync(string sessionId, string sessionCardId, string userId, FeedbackOptions feedback);
        Task<string> StartSession(string userId, string deckId);
        Task EndSession(string userId, string sessionId);
    }
}