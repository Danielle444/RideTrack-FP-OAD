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

        [HttpGet("bypayer/{payerName}")]
        public IActionResult GetByPayerName(string payerName)
        {
            try
            {
                List<Entries> entries = Entries.GetEntriesByPayerName(payerName);

                if (entries.Count == 0)
                {
                    return NotFound(new { Message = $"No entries found for payer: {payerName}" });
                }

                return Ok(entries);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut]
        public IActionResult Put([FromBody] Entries entry)
        {
            try
            { 
                if (entry == null)
                {
                    return BadRequest(new { Error = "Entry data is required" });
                }

                int rowsAffected = Entries.UpdateEntry(entry);

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        RowsAffected = rowsAffected,
                        Message = "Entry updated successfully",
                        Entry = new
                        {
                            entry.EntryId,
                            entry.RiderId,
                            entry.HorseId,
                            entry.PayerId,
                            entry.ClassId
                        }
                    });
                }
                else
                {
                    return NotFound(new { Error = "Entry not found or no changes were made" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpDelete("{Id}")]
        public IActionResult Delete(int Id)
        {
            try
            {
                int rowsAffected = Entries.DeleteEntry(Id);

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        RowsAffected = rowsAffected,
                        Message = "Entry deleted successfully",
                        DeletedEntryId = Id
                    });
                }
                else
                {
                    return NotFound(new { Error = $"Entry with ID {Id} not found" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

    }
}
