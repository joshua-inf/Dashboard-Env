import { ActualOrderType, Order } from "@/services/api/Dashboard";
import { Product } from "./product";

export type inventoryData = Product & {
   orders: ActualOrderType[],
   stock_table: stock_table[]
}

export type stock_table = {
   id: string;
   created_at: string;
   product_id: string;
   quantity: number;
   business_id: string;
}

export type InventoryResponse = {
   product_id: string | null | undefined;
   quantity: number;
   business_id: string | null | undefined;
};

export type InventoryWithProducts = {

};

export interface InventoryResponses {
   ai_name: string | null;
   ai_name_updated_at: string | null;
   business_id: string;
   category: string;
   created_at: string;
   description: string;
   id: string;
   imageName: string;
   int_business_id: number;
   name: string;
   partialPayment: number;
   price: number;
   product_id: number;
   quantity: number;
   sales: number;
}
