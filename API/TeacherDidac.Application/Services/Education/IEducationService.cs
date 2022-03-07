using System.Threading.Tasks;
using TeacherDidac.Application.Models;

namespace TeacherDidac.Application.Services.Education
{
    public interface IEducationService
    {
        Task<FrontEducationCard> GetNextFrontCard(string deckId, string userId);
        Task<BackEducationCard> SubmitCardAnswer(string deckId, string cardId, string userId);
        Task<bool> SubmitCardFeedback(string deckId, string cardId, string userId, FeedbackData feedbackData);
    }
}