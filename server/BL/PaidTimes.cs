using RideTrack_FP_OAD.DAL;

namespace RideTrack_FP_OAD.BL
{
    public class PaidTimes
    {
        public int PaidTimeId { get; set; }
        public int CompetitionId { get; set; }
        public int RiderId { get; set; }
        public int HorseId { get; set; }
        public int PayerId { get; set; }
        public String ArenaName { get; set; }
        public DateTime Day { get; set; }
        public string SlotType { get; set; }
        public Decimal Price { get; set; }

        internal static List<PaidTimes> GetAllPaidTimes()
        {
            PaidTimesDAL PaidTimeDAL = new PaidTimesDAL();
            return PaidTimeDAL.GetAllPadiTimes();
        }

        internal static int AddPaidTime(PaidTimes paidTimes)
        {
            PaidTimesDAL PaidTimeDAL = new PaidTimesDAL();
            return PaidTimeDAL.AddPaidTime(paidTimes);
        }
    }
}