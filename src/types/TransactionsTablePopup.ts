import { Customers } from "./Customers";
import { OrderData } from "./Orders";

export type TransactionTableType = {
    orderData: OrderData[],
    CustomerData: Customers[]
}