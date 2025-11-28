using Microsoft.Data.SqlClient;
using RideTrack_FP_OAD.BL;
using System.Data;

namespace RideTrack_FP_OAD.DAL
{
    public class StallsDAL:DBServices
    {
            private SqlDataReader reader;
            private SqlConnection connection;
            private SqlCommand command;
            public List<Stalls> GetAllStalls()
            {
                try
                {
                    connection = Connect("DefaultConnection");
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                command = CreateCommandWithStoredProcedure("GetAllStalls", connection, null);
                try
                {
                    List<Stalls> stalls = new List<Stalls>();
                    reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    while (reader.Read())
                    {
                        stalls.Add(new Stalls
                        {
                            StallId = Convert.ToInt32(reader["StallId"]),
                            CompetitionId = Convert.ToInt32(reader["CompetitionId"]),
                            HorseId = Convert.ToInt32(reader["HorseId"]),
                            PayerId = Convert.ToInt32(reader["PayerId"]),
                            StallNumber = Convert.ToInt32(reader["StallNumber"]),
                            ArrivalDate = Convert.ToDateTime(reader["ArrivalDate"]),
                            DepartureDate = Convert.ToDateTime(reader["DepartureDate"]),
                            DailyRate = Convert.ToDecimal(reader["DailyRate"]),
                            TotalPrice = Convert.ToDecimal(reader["TotalPrice"])

                        });
                    }
                    return stalls;
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

            public int AddStall(Stalls stall)
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
                parmDic.Add(@"StallId", stall.StallId);
                parmDic.Add("@Competition", stall.CompetitionId);
                parmDic.Add("@HorseId", stall.HorseId);
                parmDic.Add("@PayerId", stall.PayerId);
                parmDic.Add("@StallNumber", stall.StallNumber);
                parmDic.Add(@"ArrivalDate", stall.ArrivalDate);
                parmDic.Add(@"DepartureDate", stall.DepartureDate);
                parmDic.Add(@"DailyRate", stall.DailyRate);
                parmDic.Add(@"TotalPrice", stall.TotalPrice);

                command = CreateCommandWithStoredProcedure("AddStall", connection, parmDic);
                try
                {
                    reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    if (reader.Read())
                    {
                        return Convert.ToInt32(reader["NewStallId"].ToString());
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
