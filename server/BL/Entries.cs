using Microsoft.AspNetCore.Http.HttpResults;
using RideTrack_FP_OAD.DAL;
using System.Reflection.Metadata;


namespace RideTrack_FP_OAD.BL

{
    public class Entries
    {
        public int EntryId { get; set; }
        public int RiderId { get; set; }
        public int HorseId { get; set; }
        public int PayerId { get; set; }
        public int ClassId { get; set; }

        public string RiderName { get; set; }
        public string HorseName { get; set; }
        public string PayerName { get; set; }
        public string CompetitionName { get; set; }
        public string ClassName { get; set; }
        public DateTime ClassDay { get; set; }
        public Decimal ClassPrice { get; set; }

        internal static List<Entries> GetAllEntries()
        {
            EntriesDAL entriesDAL = new EntriesDAL();
            return entriesDAL.GetAllEntries();
        }

        internal static List<Entries> GetEntriesByPayerName(string payerName)
        {
            if (payerName == null)
            {
                throw new ArgumentException("Payer name cannot be empty!");
            }

            EntriesDAL entriesDAL = new EntriesDAL();
            return entriesDAL.GetEntriesByPayerName(payerName);
        }

        internal static int AddEntry(Entries entry)
        {
            EntriesDAL entriesDAL = new EntriesDAL();
            return entriesDAL.AddEntry(entry);
        }

        internal static int UpdateEntry(Entries entry)
        {
            if (entry.EntryId <= 0)
            {
                throw new ArgumentException("Invalid Entry ID");
            }
            if (entry.RiderId <= 0)
            {
                throw new ArgumentException("Invalid Rider ID");
            }
            if (entry.HorseId <= 0)
            {
                throw new ArgumentException("Invalid Horse ID");
            }
            if (entry.PayerId <= 0)
            {
                throw new ArgumentException("Invalid Payer ID");
            }
            if (entry.ClassId <= 0)
            {
                throw new ArgumentException("Invalid Class ID");
            }

            EntriesDAL entriesDAL = new EntriesDAL();
            return entriesDAL.UpdateEntry(entry);
        }

        internal static int DeleteEntry(int entryId)
        {
            if (entryId <= 0)
            {
                throw new ArgumentException("Entry ID must be greater than 0");
            }
            EntriesDAL entriesDAL = new EntriesDAL();
            return entriesDAL.DeleteEntry(entryId);
        }
    }
}
