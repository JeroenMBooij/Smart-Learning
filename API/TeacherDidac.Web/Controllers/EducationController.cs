using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;
using TeacherDidac.Application.Models;
using TeacherDidac.Application.Services.Education;
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

        [HttpGet("deck/{deckId}/card/front/next", Name = "GetNextFrontCard")]
        [ProducesResponseType(typeof(EducationCard), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<FrontEducationCard>> GetNextFrontCard(string deckId)
        {
            string uid = Request.Headers["userid"];

            FrontEducationCard nextCard = await _educationService.GetNextFrontCard(deckId, uid);

            if (nextCard == null)
                return NotFound();

            return Ok(nextCard);
        }

        [HttpPost("deck/{deckId}/card/{cardId}/back", Name = "SubmitCardAnswer")]
        [ProducesResponseType(typeof(EducationCard), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EducationCard>> SubmitCardAnswer(string deckId, string cardId)
        {
            string uid = Request.Headers["userid"];

            BackEducationCard nextCard = await _educationService.SubmitCardAnswer(deckId, cardId, uid);

            if (nextCard == null)
                return NotFound();

            return Ok(nextCard);
        }

        [HttpPost("deck/{deckId}/card/{cardId}/feedback", Name = "SubmitCardFeedback")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EducationCard>> SubmitCardFeedback(string deckId, string cardId, [FromBody] FeedbackData feedbackData)
        {
            string uid = Request.Headers["userid"];

            bool result = await _educationService.SubmitCardFeedback(deckId, cardId, uid, feedbackData);

            if (result == false)
                return NotFound();

            return Ok();
        }
    }
}
