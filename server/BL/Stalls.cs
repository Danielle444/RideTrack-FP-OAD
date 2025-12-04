using RideTrack_FP_OAD.DAL;

namespace RideTrack_FP_OAD.BL
{
    public class Stalls
    {
        public int StallId { get; set; }
        public int CompetitionId { get; set; }
        public int HorseId { get; set; }
        public int PayerId { get; set; }
        public int? StallNumber { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string? CompetitionName { get; set; }
        public string? HorseName { get; set; }
        public string? PayerName { get; set; }
        public Decimal? DailyRate { get; set; }
        public Decimal? TotalPrice { get; set; }
        internal static List<Stalls> GetAllStalls()
        {
            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.GetAllStalls();
        }

        internal static List<Stalls> GetStallsByPayerName(string payerName)
        {
            if (string.IsNullOrWhiteSpace(payerName))
                throw new ArgumentException("Payer name cannot be empty.");

            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.GetStallsByPayerName(payerName);
        }

        internal static int AddStall(Stalls stall)
        {
            ValidateStall(stall, requireId: false);

            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.AddStall(stall);
        }

        internal static int UpdateStall(Stalls stall)
        {
            ValidateStall(stall, requireId: true);

            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.UpdateStall(stall);
        }

        internal static int DeleteStall(int stallId)
        {
            if (stallId <= 0)
                throw new ArgumentException("Stall ID must be greater than 0.");

            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.DeleteStall(stallId);
        }

        private static void ValidateStall(Stalls stall, bool requireId)
        {
            if (stall == null)
                throw new ArgumentException("Stall data is required.");

            if (requireId && stall.StallId <= 0)
                throw new ArgumentException("Invalid Stall ID.");

            if (stall.CompetitionId <= 0)
                throw new ArgumentException("Invalid Competition ID.");

            if (stall.HorseId <= 0)
                throw new ArgumentException("Invalid Horse ID.");

            if (stall.PayerId <= 0)
                throw new ArgumentException("Invalid Payer ID.");

            if (stall.StallNumber <= 0)
                throw new ArgumentException("Stall number must be greater than 0.");

            if (stall.ArrivalDate == default(DateTime))
                throw new ArgumentException("Arrival date is required.");

            if (stall.DepartureDate == default(DateTime))
                throw new ArgumentException("Departure date is required.");

            if (stall.DepartureDate < stall.ArrivalDate)
                throw new ArgumentException("Departure date cannot be earlier than arrival date.");

            if (stall.DailyRate < 0)
                throw new ArgumentException("Daily rate cannot be negative.");

            if (stall.TotalPrice < 0)
                throw new ArgumentException("Total price cannot be negative.");
        }
    }
}
