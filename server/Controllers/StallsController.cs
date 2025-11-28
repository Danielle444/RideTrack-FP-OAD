using Microsoft.AspNetCore.Mvc;
using RideTrack_FP_OAD.BL;

namespace RideTrack_FP_OAD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StallsController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Stalls> stalls = Stalls.GetAllStalls();
                return Ok(stalls);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Stalls stall)
        {
            try
            {
                int res = Stalls.AddStall(stall);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
