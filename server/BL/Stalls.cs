using RideTrack_FP_OAD.DAL;

namespace RideTrack_FP_OAD.BL
{
    public class Stalls
    {
       public int StallId {  get; set; }
       public int CompetitionId {  get; set; }
       public int HorseId {  get; set; }
       public int PayerId {  get; set; }
       public int StallNumber {  get; set; }
       public DateTime ArrivalDate {  get; set; }
       public DateTime DepartureDate {  get; set; }
       public Decimal DailyRate {  get; set; }
       public Decimal TotalPrice { get; set; }
        internal static List<Stalls> GetAllStalls()
        {
            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.GetAllStalls();
        }

        internal static int AddStall(Stalls stalls)
        {
            StallsDAL stallsDAL = new StallsDAL();
            return stallsDAL.AddStall(stalls);
        }
    }
}
