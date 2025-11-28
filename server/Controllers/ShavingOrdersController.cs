using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RideTrack_FP_OAD.BL;

namespace RideTrack_FP_OAD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShavingOrdersController : ControllerBase
    {
            [HttpGet]
            public IActionResult Get()
            {
                try
                {
                    List<ShavingsOrders> shavingsOrders = ShavingsOrders.GetAllShavingsOrders();
                    return Ok(shavingsOrders);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpPost]
            public IActionResult Post([FromBody] ShavingsOrders shavingsOrders)
            {
                try
                {
                    int res = ShavingsOrders.AddShavingOrder(shavingsOrders);
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
}
