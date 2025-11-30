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
                List<ShavingsOrders> orders = new List<ShavingsOrders>();
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);

                while (reader.Read())
                {
                    orders.Add(new ShavingsOrders
                    {
                        ShavingsOrderId = Convert.ToInt32(reader["ShavingsOrderId"]),
                        StallId = Convert.ToInt32(reader["StallId"]),
                        OrderDate = Convert.ToDateTime(reader["OrderDate"]),
                        BagsQuantity = Convert.ToInt32(reader["BagsQuantity"]),
                        PricePerBag = Convert.ToDecimal(reader["PricePerBag"]),
                        TotalPrice = Convert.ToDecimal(reader["TotalPrice"])
                    });
                }

                return orders;
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

        public List<ShavingsOrders> GetShavingsOrdersByPayerName(string payerName)
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
            parmDic.Add("@PayerName", payerName);

            command = CreateCommandWithStoredProcedure("GetShavingsOrdersByPayerName", connection, parmDic);

            try
            {
                List<ShavingsOrders> orders = new List<ShavingsOrders>();
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);

                while (reader.Read())
                {
                    orders.Add(new ShavingsOrders
                    {
                        ShavingsOrderId = Convert.ToInt32(reader["ShavingsOrderId"]),
                        StallId = Convert.ToInt32(reader["StallId"]),
                        OrderDate = Convert.ToDateTime(reader["OrderDate"]),
                        BagsQuantity = Convert.ToInt32(reader["BagsQuantity"]),
                        PricePerBag = Convert.ToDecimal(reader["PricePerBag"]),
                        TotalPrice = Convert.ToDecimal(reader["TotalPrice"])
                    });
                }

                return orders;
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

        public int AddShavingsOrder(ShavingsOrders order)
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
            parmDic.Add("@StallId", order.StallId);
            parmDic.Add("@OrderDate", order.OrderDate);
            parmDic.Add("@BagsQuantity", order.BagsQuantity);
            parmDic.Add("@PricePerBag", order.PricePerBag);
            parmDic.Add("@TotalPrice", order.TotalPrice);

            command = CreateCommandWithStoredProcedure("AddShavingsOrder", connection, parmDic);

            try
            {
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                if (reader.Read())
                {
                    return Convert.ToInt32(reader["NewShavingsOrderId"].ToString());
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

        public int UpdateShavingsOrder(ShavingsOrders order)
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
            parmDic.Add("@ShavingsOrderId", order.ShavingsOrderId);
            parmDic.Add("@StallId", order.StallId);
            parmDic.Add("@OrderDate", order.OrderDate);
            parmDic.Add("@BagsQuantity", order.BagsQuantity);
            parmDic.Add("@PricePerBag", order.PricePerBag);
            parmDic.Add("@TotalPrice", order.TotalPrice);

            command = CreateCommandWithStoredProcedure("UpdateShavingsOrder", connection, parmDic);

            try
            {
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                if (reader.Read())
                {
                    return Convert.ToInt32(reader["RowsAffected"]);
                }
                else
                {
                    return 0;
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

        public int DeleteShavingsOrder(int shavingsOrderId)
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
            parmDic.Add("@ShavingsOrderId", shavingsOrderId);

            command = CreateCommandWithStoredProcedure("DeleteShavingsOrder", connection, parmDic);

            try
            {
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                if (reader.Read())
                {
                    return Convert.ToInt32(reader["RowsAffected"]);
                }
                else
                {
                    return 0;
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

