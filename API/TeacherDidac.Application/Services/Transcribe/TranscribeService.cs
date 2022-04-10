using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Infrastructure;
using TeacherDidac.Application.Models;

namespace TeacherDidac.Application.Services.Transcribe
{
    public class TranscribeService : ITranscribeService
    {
        private readonly ITranscribeClient _transcribeClient;

        public TranscribeService(ITranscribeClient transcribeClient)
        {
            _transcribeClient = transcribeClient;
        }

        public async Task<Transcription> ComputerVision(string sessionId, string sessionCardId, IFormFile file, string userId)
        {
            var transcription = await ComputerVision(file, userId);
            if (transcription == null)
                return null;

            return transcription;
        }

        public async Task<Transcription> ComputerVision(IFormFile file, string userId)
        {
            Dictionary<string, decimal> results = await _transcribeClient.ComputerVision(file);
            if (results == null)
                return null;

            var result = results.OrderByDescending(x => x.Value).First();

            var transcription = new Transcription()
            {
                RecognizedValue = result.Key,
                Confidence = result.Value
            };

            return transcription;
        }

    }
}
