using Microsoft.Data.SqlClient;
using RideTrack_FP_OAD.BL;
using System.Data;

namespace RideTrack_FP_OAD.DAL
{
    public class ShavingsOrdersDAL : DBServices
    {
        private SqlDataReader reader;
        private SqlConnection connection;
        private SqlCommand command;
        public List<ShavingsOrders> GetAllShavingsOrders()
        {
            try
            {
                connection = Connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            command = CreateCommandWithStoredProcedure("GetAllShavingsOrders", connection, null);
            try
            {
                List<ShavingsOrders> shavingOrder = new List<ShavingsOrders>();
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                while (reader.Read())
                {
                    shavingOrder.Add(new ShavingsOrders
                    {
                        ShavingsOrderId = Convert.ToInt32(reader["ShavingsOrderId"]),
                        StallId = Convert.ToInt32(reader["StallId"]),
                        OrderDate = Convert.ToDateTime(reader["OrderDate"]),
                        BagsQuantity = Convert.ToInt32(reader["BagsQuantity"]),
                        PricePerBag = Convert.ToDecimal(reader["PricePerBag"]),
                        TotalPrice = Convert.ToDecimal(reader["TotalPrice"])
                        });
                }
                return shavingOrder;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (connection != null)
                {
                    connection.Close();
                }
            }
        }

        public int AddShavingOrder(ShavingsOrders shavingOrder)
        {
            try
            {
                connection = Connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            Dictionary<string, object> parmDic = new Dictionary<string, object>();
            parmDic.Add(@"ShavingsOrderId",shavingOrder.ShavingsOrderId);
            parmDic.Add("@RiderId", shavingOrder.StallId);
            parmDic.Add("@HorseId", shavingOrder.OrderDate);
            parmDic.Add("@PayerId", shavingOrder.BagsQuantity);
            parmDic.Add("@CompetitionId", shavingOrder.PricePerBag);
            parmDic.Add(@"ArenaName", shavingOrder.TotalPrice);
            command = CreateCommandWithStoredProcedure("AddShavingOrders", connection, parmDic);
            try
            {
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                if (reader.Read())
                {
                    return Convert.ToInt32(reader["NewShavingOrderId"].ToString());
                }
                else
                {
                    return -1;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (connection != null)
                {
                    connection.Close();
                }
            }
        }
    }
}
