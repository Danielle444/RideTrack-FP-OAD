using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RideTrack_FP_OAD.BL;

namespace RideTrack_FP_OAD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaidTimeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<PaidTimes> paidtimes = PaidTimes.GetAllPaidTimes();
                return Ok(paidtimes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] PaidTimes paidtimes)
        {
            try
            {
                int res = PaidTimes.AddPaidTime(paidtimes);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

