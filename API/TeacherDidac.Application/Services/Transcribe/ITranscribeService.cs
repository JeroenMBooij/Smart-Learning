using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using TeacherDidac.Application.Models;

namespace TeacherDidac.Application.Services.Transcribe
{
    public interface ITranscribeService
    {
        Task<Transcription> ComputerVision(string sessionId, string sessionCardId, IFormFile file, string userId);
        Task<Transcription> ComputerVision(IFormFile file, string userId);
    }
}