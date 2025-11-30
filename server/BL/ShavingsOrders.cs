using RideTrack_FP_OAD.DAL;

namespace RideTrack_FP_OAD.BL
{
    public class ShavingsOrders
    {
        public int ShavingsOrderId { get; set; }
        public int StallId { get; set; }
        public DateTime OrderDate { get; set; }
        public int BagsQuantity { get; set; }
        public decimal PricePerBag { get; set; }
        public decimal TotalPrice { get; set; }

        internal static List<ShavingsOrders> GetAllShavingsOrders()
        {
            ShavingsOrdersDAL dal = new ShavingsOrdersDAL();
            return dal.GetAllShavingsOrders();
        }

        internal static List<ShavingsOrders> GetShavingsOrdersByPayerName(string payerName)
        {
            if (string.IsNullOrWhiteSpace(payerName))
                throw new ArgumentException("Payer name cannot be empty.");

            ShavingsOrdersDAL dal = new ShavingsOrdersDAL();
            return dal.GetShavingsOrdersByPayerName(payerName);
        }

        internal static int AddShavingsOrder(ShavingsOrders order)
        {
            ValidateShavingsOrder(order, requireId: false);

            ShavingsOrdersDAL dal = new ShavingsOrdersDAL();
            return dal.AddShavingsOrder(order);
        }

        internal static int UpdateShavingsOrder(ShavingsOrders order)
        {
            ValidateShavingsOrder(order, requireId: true);

            ShavingsOrdersDAL dal = new ShavingsOrdersDAL();
            return dal.UpdateShavingsOrder(order);
        }

        internal static int DeleteShavingsOrder(int shavingsOrderId)
        {
            if (shavingsOrderId <= 0)
                throw new ArgumentException("ShavingsOrder ID must be greater than 0.");

            ShavingsOrdersDAL dal = new ShavingsOrdersDAL();
            return dal.DeleteShavingsOrder(shavingsOrderId);
        }

        private static void ValidateShavingsOrder(ShavingsOrders order, bool requireId)
        {
            if (order == null)
                throw new ArgumentException("Shavings order data is required.");

            if (requireId && order.ShavingsOrderId <= 0)
                throw new ArgumentException("Invalid ShavingsOrder ID.");

            if (order.StallId <= 0)
                throw new ArgumentException("Invalid Stall ID.");

            if (order.OrderDate == default(DateTime))
                throw new ArgumentException("Order date is required.");

            if (order.BagsQuantity <= 0)
                throw new ArgumentException("Bags quantity must be greater than 0.");

            if (order.PricePerBag < 0)
                throw new ArgumentException("Price per bag cannot be negative.");

            if (order.TotalPrice < 0)
                throw new ArgumentException("Total price cannot be negative.");
        }
    }
}
