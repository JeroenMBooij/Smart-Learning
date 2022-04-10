using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Infrastructure;
using TeacherDidac.Application.Models;

namespace TeacherDidac.Infrastructure.Transcribe
{
    public class TranscribeClient : ITranscribeClient
    {
        private HttpClient _client;
        public TranscribeClient(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _client.BaseAddress = new Uri(configuration["RECOGNITION_SERVER_URL"]);
            _client.DefaultRequestHeaders.Add("accept", "application/json");
        }

        public async Task<Dictionary<string, decimal>> ComputerVision(IFormFile image)
        {
            using (var form = new MultipartFormDataContent())
            {
                using (var memoryStream = new MemoryStream())
                {
                    form.Add(new StreamContent(image.OpenReadStream()), "file", image.FileName);

                    using (HttpResponseMessage response = await _client.PostAsync("/computer-vision/read/text/", form))
                    {
                        if (response.IsSuccessStatusCode == false)
                            return null;

                        var test = await response.Content.ReadAsStringAsync();
                        var transcribeResult = JsonSerializer.Deserialize<Dictionary<string, decimal>>(await response.Content.ReadAsStringAsync());

                        return transcribeResult;
                    }

                }
            }
        }
    }
}
