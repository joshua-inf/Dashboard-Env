import { ActualOrderType, Order } from "@/services/api/Dashboard";
import { Product } from "./product";

export type inventoryData = Product & {
   orders: ActualOrderType[],
   stock_table:stock_table[]      
}

export type stock_table = {
    id: string;
    created_at : string;
    product_id: string;
    quantity: number;
    business_id: string;

} 

export type InventoryResponse = {
   product_id : string | null | undefined;
   quantity: number;
   business_id: string | null | undefined;
};

export type InventoryWithProducts = {
   
};