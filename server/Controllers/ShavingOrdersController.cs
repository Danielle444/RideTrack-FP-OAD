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

        [HttpGet("bypayer/{payerName}")]
        public IActionResult GetByPayerName(string payerName)
        {
            try
            {
                List<ShavingsOrders> shavingsOrders = ShavingsOrders.GetShavingsOrdersByPayerName(payerName);

                if (shavingsOrders.Count == 0)
                {
                    return NotFound($"No shavings orders found for payer: {payerName}");
                }

                return Ok(shavingsOrders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] ShavingsOrders shavingsOrder)
        {
            try
            {
                int res = ShavingsOrders.AddShavingsOrder(shavingsOrder);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public IActionResult Put([FromBody] ShavingsOrders shavingsOrder)
        {
            try
            {
                if (shavingsOrder == null)
                {
                    return BadRequest("Shavings order data is required.");
                }

                int rowsAffected = ShavingsOrders.UpdateShavingsOrder(shavingsOrder);

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        RowsAffected = rowsAffected,
                        Message = "Shavings order updated successfully",
                        ShavingsOrder = new
                        {
                            shavingsOrder.ShavingsOrderId,
                            shavingsOrder.StallId,
                            shavingsOrder.OrderDate,
                            shavingsOrder.BagsQuantity,
                            shavingsOrder.PricePerBag,
                            shavingsOrder.TotalPrice
                        }
                    });
                }
                else
                {
                    return NotFound("Shavings order not found or no changes were made.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                int rowsAffected = ShavingsOrders.DeleteShavingsOrder(id);

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        RowsAffected = rowsAffected,
                        Message = "Shavings order deleted successfully",
                        DeletedShavingsOrderId = id
                    });
                }
                else
                {
                    return NotFound($"Shavings order with ID {id} not found.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
