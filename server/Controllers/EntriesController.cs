using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RideTrack_FP_OAD.BL;

namespace RideTrack_FP_OAD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntriesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Entries> entries = Entries.GetAllEntries();
                return Ok(entries);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Entries entry)
        {
            try
            {
                int res = Entries.AddEntry(entry);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
