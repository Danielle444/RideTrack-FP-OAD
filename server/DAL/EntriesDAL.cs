using Microsoft.Data.SqlClient;
using RideTrack_FP_OAD.BL;
using System.Data;


namespace RideTrack_FP_OAD.DAL
{
    public class EntriesDAL:DBServices
    {
        private SqlDataReader reader;
        private SqlConnection connection;
        private SqlCommand command;

        public List <Entries> GetAllEntries()
        {
            try {
                connection = Connect("DefaultConnection");
            }
            catch(Exception ex) {
                throw ex;
            }
            command = CreateCommandWithStoredProcedure("GetAllEntries", connection, null);
            try
            {
                List <Entries> entries = new List <Entries>();
                reader= command.ExecuteReader(CommandBehavior.CloseConnection);
                while (reader.Read())
                {
                    entries.Add(new Entries
                    {
                        EntryId = Convert.ToInt32(reader["EntryId"]),
                        RiderId = Convert.ToInt32(reader["RiderId"]),
                        HorseId = Convert.ToInt32(reader["HorseId"]),
                        PayerId = Convert.ToInt32(reader["PayerId"]),
                        ClassId = Convert.ToInt32(reader["ClassId"]),
                        RiderName = reader["RiderName"].ToString(),
                        HorseName = reader["HorseName"].ToString(),
                        PayerName = reader["PayerName"].ToString(),
                        CompetitionName = reader["CompetitionName"].ToString(),
                        ClassName = reader["ClassName"].ToString(),
                        ClassDay = Convert.ToDateTime(reader["ClassDay"]),
                        ClassPrice = Convert.ToDecimal(reader["ClassPrice"])
                    });
                }
                return entries;
            }
            catch(Exception ex)
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

        public int AddEntry(Entries entry)
        {
            try
            {
                connection = Connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            Dictionary<string,object> parmDic = new Dictionary<string,object>();
            parmDic.Add(@"EntryId", entry.EntryId);
            parmDic.Add("@RiderId", entry.RiderId);
            parmDic.Add("@HorseId", entry.HorseId);
            parmDic.Add("@PayerId", entry.PayerId);
            parmDic.Add("@ClassId", entry.ClassId);
            command = CreateCommandWithStoredProcedure("AddEntry", connection, parmDic);
            try
            {
                reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                if (reader.Read())
                {
                    return Convert.ToInt32(reader["NewEntryId"].ToString());
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
