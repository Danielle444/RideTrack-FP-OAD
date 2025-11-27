using RideTrack_FP_OAD.DAL;


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

        internal static int AddEntry(Entries entry)
        {
            EntriesDAL entriesDAL = new EntriesDAL();
            return entriesDAL.AddEntry(entry);
        }
    }
}
