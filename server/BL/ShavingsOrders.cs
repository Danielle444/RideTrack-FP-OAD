using RideTrack_FP_OAD.DAL;

namespace RideTrack_FP_OAD.BL
{
    public class ShavingsOrders
    {
       public int ShavingsOrderId { get; set; }
       public int StallId { get; set; }
       public DateTime OrderDate { get; set; }
       public int BagsQuantity { get; set; }
       public Decimal PricePerBag { get; set; }
       public Decimal TotalPrice { get; set; }
        internal static List<ShavingsOrders> GetAllShavingsOrders()
        {
            ShavingsOrdersDAL shavingsordersDAL = new ShavingsOrdersDAL();
            return shavingsordersDAL.GetAllShavingsOrders();
        }

        internal static int AddShavingOrder(ShavingsOrders shavingsOrders)
        {
            ShavingsOrdersDAL shavingsOrdersDAL = new ShavingsOrdersDAL();
            return shavingsOrdersDAL.AddShavingOrder(shavingsOrders);
        }
    }
}
