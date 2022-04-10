using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeacherDidac.Application.Models;

namespace TeacherDidac.Application.Contracts.Infrastructure
{
    public interface ITranscribeClient
    {
        Task<Dictionary<string, decimal>> ComputerVision(IFormFile image);
    }
}
