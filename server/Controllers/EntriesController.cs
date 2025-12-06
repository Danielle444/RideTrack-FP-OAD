using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RideTrack_FP_OAD.BL;

namespace RideTrack_FP_OAD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntriesController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public EntriesController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

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

        [HttpGet("bypayer/{payerName}")]
        public IActionResult GetByPayerName(string payerName)
        {
            try
            {
                List<Entries> entries = Entries.GetEntriesByPayerName(payerName);

                if (entries.Count == 0)
                {
                    return NotFound($"No entries found for payer: {payerName}");
                }

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

        [HttpPost("upload-veterinary-document/{entryId}")]
        public async Task<IActionResult> UploadVeterinaryDocument(int entryId, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                if (entryId <= 0)
                    return BadRequest("Invalid Entry ID");

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Invalid file type. Allowed: PDF, JPG, PNG");

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest("File size exceeds 5MB limit");

                var fileName = $"vet_doc_entry_{entryId}_{DateTime.Now:yyyyMMdd_HHmmss}{extension}";

                var wwwrootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
                var documentsFolder = Path.Combine(wwwrootPath, "documents", "veterinary");

                if (!Directory.Exists(documentsFolder))
                {
                    Directory.CreateDirectory(documentsFolder);
                }

                var filePath = Path.Combine(documentsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = $"/documents/veterinary/{fileName}";
                int rowsAffected = Entries.UpdateVeterinaryDocument(entryId, relativePath);

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        Message = "Veterinary document uploaded successfully",
                        DocumentPath = relativePath,
                        EntryId = entryId
                    });
                }
                else
                {
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);

                    return NotFound($"Entry with ID {entryId} not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "Error uploading document",
                    Error = ex.Message
                });
            }
        }

        [HttpPut]
        public IActionResult Put([FromBody] Entries entry)
        {
            try
            {
                if (entry == null)
                {
                    return BadRequest("Entry data is required");
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
                    return NotFound("Entry not found or no changes were made");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
                    return NotFound($"Entry with ID {Id} not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}