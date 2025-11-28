using Microsoft.Data.SqlClient;
using RideTrack_FP_OAD.BL;
using System.Data;

namespace RideTrack_FP_OAD.DAL
{
    public class PaidTimesDAL:DBServices
    {
        private SqlDataReader reader;
        private SqlConnection connection;
        private SqlCommand command;
        public List<PaidTimes> GetAllPadiTimes()
        {
            try
            {
                connection = Connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            command = CreateCommandWithStoredProcedure("GetAllPaidTimes", connection, null);
            try
            {
                List<PaidTimes> paidtimes = new List<PaidTimes>();
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                while (reader.Read())
                {
                    paidtimes.Add(new PaidTimes
                    {
                        PaidTimeId = Convert.ToInt32(reader["PaidTimeId"]),
                        RiderId = Convert.ToInt32(reader["RiderId"]),
                        HorseId = Convert.ToInt32(reader["HorseId"]),
                        PayerId = Convert.ToInt32(reader["PayerId"]),
                        CompetitionId = Convert.ToInt32(reader["CompetitionId"]), 
                        ArenaName = reader["ArenaName"].ToString(),
                        Day = Convert.ToDateTime(reader["Day"]),
                        SlotType = reader["SlotType"].ToString(),
                        Price = Convert.ToDecimal(reader["Price"]),
                        });
                }
                return paidtimes;
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

        public int AddPaidTime(PaidTimes paidTimes)
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
            parmDic.Add(@"PaidTimeId", paidTimes.PaidTimeId);
            parmDic.Add("@RiderId", paidTimes.RiderId);
            parmDic.Add("@HorseId", paidTimes.HorseId);
            parmDic.Add("@PayerId", paidTimes.PayerId);
            parmDic.Add("@CompetitionId", paidTimes.CompetitionId);
            parmDic.Add(@"ArenaName", paidTimes.ArenaName);
            parmDic.Add(@"Day", paidTimes.Day);
            parmDic.Add(@"SlotType", paidTimes.SlotType);
            parmDic.Add(@"Price",paidTimes.Price);

            command = CreateCommandWithStoredProcedure("AddPaidTime", connection, parmDic);
            try
            {
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                if (reader.Read())
                {
                    return Convert.ToInt32(reader["NewPaidTimeId"].ToString());
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
