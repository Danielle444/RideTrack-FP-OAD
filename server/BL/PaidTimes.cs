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
        public string? CompetitionName { get; set; }
        public string? RiderName { get; set; }
        public string? HorseName { get; set; }
        public string? PayerName { get; set; }
        public String? ArenaName { get; set; }
        public DateTime? Day { get; set; }
        public string? SlotType { get; set; }
        public Decimal? Price { get; set; }

        internal static List<PaidTimes> GetAllPaidTimes()
        {
            PaidTimesDAL PaidTimeDAL = new PaidTimesDAL();
            return PaidTimeDAL.GetAllPadiTimes();
        }

        internal static List<PaidTimes> GetPaidTimesByPayerName(string payerName)
        {
            if (string.IsNullOrWhiteSpace(payerName))
            {
                throw new ArgumentException("Payer name cannot be empty.");
            }

            PaidTimesDAL paidTimeDAL = new PaidTimesDAL();
            return paidTimeDAL.GetPaidTimesByPayerName(payerName);
        }

        internal static int AddPaidTime(PaidTimes paidTimes)
        {
            ValidatePaidTime(paidTimes, requireId: false);

            PaidTimesDAL paidTimeDAL = new PaidTimesDAL();
            return paidTimeDAL.AddPaidTime(paidTimes);
        }

        internal static int UpdatePaidTime(PaidTimes paidTimes)
        {
            ValidatePaidTime(paidTimes, requireId: true);

            PaidTimesDAL paidTimeDAL = new PaidTimesDAL();
            return paidTimeDAL.UpdatePaidTime(paidTimes);
        }

        internal static int DeletePaidTime(int paidTimeId)
        {
            if (paidTimeId <= 0)
            {
                throw new ArgumentException("PaidTime ID must be greater than 0.");
            }

            PaidTimesDAL paidTimeDAL = new PaidTimesDAL();
            return paidTimeDAL.DeletePaidTime(paidTimeId);
        }

        private static void ValidatePaidTime(PaidTimes paidTimes, bool requireId)
        {
            if (paidTimes == null)
                throw new ArgumentException("PaidTime data is required.");

            if (requireId && paidTimes.PaidTimeId <= 0)
                throw new ArgumentException("Invalid PaidTime ID.");

            if (paidTimes.CompetitionId <= 0)
                throw new ArgumentException("Invalid Competition ID.");

            if (paidTimes.RiderId <= 0)
                throw new ArgumentException("Invalid Rider ID.");

            if (paidTimes.HorseId <= 0)
                throw new ArgumentException("Invalid Horse ID.");

            if (paidTimes.PayerId <= 0)
                throw new ArgumentException("Invalid Payer ID.");

            if (string.IsNullOrWhiteSpace(paidTimes.ArenaName))
                throw new ArgumentException("Arena name is required.");

            if (paidTimes.Day == default(DateTime))
                throw new ArgumentException("Day is required.");

            if (string.IsNullOrWhiteSpace(paidTimes.SlotType))
                throw new ArgumentException("Slot type is required.");

            if (paidTimes.Price < 0)
                throw new ArgumentException("Price cannot be negative.");
        }
    }
}