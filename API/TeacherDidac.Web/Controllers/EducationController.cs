using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TeacherDidac.Application.Models;
using TeacherDidac.Application.Services.Education;
using TeacherDidac.Common.Enums;
using TeacherDidac.Web.Middleware.Auth;

namespace TeacherDidac.Web.Controllers
{
    [ServiceFilter(typeof(CustomAuthAttribute))]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EducationController : ControllerBase
    {
        private readonly IEducationService _educationService;

        public EducationController(IEducationService educationService)
        {
            _educationService = educationService;
        }

        [HttpGet("session/start/deck/{deckId}", Name = "StartSession")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> StartSession(string deckId)
        {
            string uid = Request.Headers["userid"];

            string sessionId = await _educationService.StartSession(uid, deckId);

            if (string.IsNullOrEmpty(sessionId))
                return NotFound();

            return Ok(sessionId);
        }

        [HttpPut("session/{sessionId}/end", Name = "EndSession")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> EndSession(string sessionId)
        {
            string uid = Request.Headers["userid"];

            await _educationService.EndSession(uid, sessionId);

            return NoContent();
        }

        [HttpGet("session/{sessionId}/next-question", Name = "GetNextFrontCard")]
        [ProducesResponseType(typeof(EducationCard), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<FrontEducationCard>> GetNextFrontCard(string sessionId)
        {
            string uid = Request.Headers["userid"];

            FrontEducationCard nextCard = await _educationService.GetNextFrontCardAsync(sessionId, uid);

            if (nextCard == null)
                return NotFound();

            return Ok(nextCard);
        }

        [HttpPost("session/{sessionId}/session-card/{sessionCardId}/answer", Name = "SubmitCardAnswer")]
        [ProducesResponseType(typeof(EducationCard), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BackEducationCard>> SubmitCardAnswer(string sessionId, string sessionCardId)
        {
            string uid = Request.Headers["userid"];

            BackEducationCard nextCard = await _educationService.SubmitCardAnswerAsync(sessionId, sessionCardId, uid);

            if (nextCard == null)
                return NotFound();

            return Ok(nextCard);
        }

        [HttpPost("session/{sessionId}/session-card/{sessionCardId}/feedback", Name = "SubmitCardFeedback")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> SubmitCardFeedback(string sessionId, string sessionCardId, [FromBody] string feedback)
        {
            string uid = Request.Headers["userid"];

            var feed = Enum.Parse<FeedbackOptions>(feedback);
            bool result = await _educationService.SubmitCardFeedbackAsync(sessionId, sessionCardId, uid, feed);

            if (result == false)
                return NotFound();

            return Ok();
        }
    }
}
