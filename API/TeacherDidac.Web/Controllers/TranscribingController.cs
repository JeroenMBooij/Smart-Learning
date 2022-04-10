using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TeacherDidac.Application.Models;
using TeacherDidac.Application.Services.Transcribe;
using TeacherDidac.Web.Middleware.Auth;

namespace TeacherDidac.Web.Controllers
{
    //[ServiceFilter(typeof(CustomAuthAttribute))]
    [Route("api/[controller]")]
    [ApiController]
    public class TranscribingController : ControllerBase
    {
        private readonly ITranscribeService _transcribeService;

        public TranscribingController(ITranscribeService transcribeService)
        {
            _transcribeService = transcribeService;
        }


        [Consumes("multipart/form-data")]
        [HttpPost("computer-vision/session/{sessionId}/sessionCard/{sessionCardId}", Name = "TranscribeComputerVision")]
        [ProducesResponseType(typeof(Transcription), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Transcription), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Transcription>> TranscribeComputerVision(string sessionId, string sessionCardId, IFormFile file)
        {
            string uid = Request.Headers["userid"];

            if (sessionId == "test")
            {
                Transcription transcription = await _transcribeService.ComputerVision(file, uid);

                return Ok(transcription);
            }
            else
            {
                Transcription transcription = await _transcribeService.ComputerVision(sessionId, sessionCardId, file, uid);

                if (transcription == null)
                    return NotFound();

                //TODO provide crud url
                return Created("", transcription);
            }

        }
    }
}
