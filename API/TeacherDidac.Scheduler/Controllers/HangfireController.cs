using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace TeacherDidac.Scheduler.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HangfireController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetNextFrontCard()
        {
            return Ok("Hello from Hangfire");
        }
    }
}
