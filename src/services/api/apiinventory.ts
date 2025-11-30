import { inventoryData, InventoryResponse, InventoryResponses, stock_table } from "@/types/inventoryTypes"
import { supabase } from "../SupabaseConfig"
import { getProductsAndServices } from "./products"

export const getInventory = async (businessid: string | undefined | null): Promise<{ allInventory: InventoryResponses[] }> => {
    return new Promise(async (resolve, reject) => {
        let allProductsWithSales = await getProductsAndServices(businessid)
        let inventoryWithProducts: any[] = []

        if (allProductsWithSales) {
            // now to fillter out the data needed
            let allInventory = await allInventoryData(businessid ?? "")

            for (let i = 0; i < allProductsWithSales.length; i++) {
                const inventoryItem = allProductsWithSales[i];
                const productStock = allInventory?.filter((product) => product.id === inventoryItem.id);

                if (productStock) {
                    if (productStock.length > 0) {
                        let totalQuantity = productStock[0].stock_table.reduce((acc, curr) => acc + curr.quantity, 0);
                        inventoryWithProducts.push({
                            ...inventoryItem,
                            quantity: totalQuantity
                        })
                    }
                } else {
                    continue;
                }

            }
        }


        resolve({
            allInventory: inventoryWithProducts
        })
    })
}

export const allInventoryData = async (businesId: string): Promise<{ id: any; stock_table: any[]; }[] | null> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, stock_table(*)')
            .eq('business_id', businesId)

        if (data) {
            return data
        }
    } catch (error) {
        console.log(error)
    }

    return null
}

export const addInventory = async (inventory: InventoryResponse) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('stock_table')
                .insert(inventory)

            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
        } catch (error) {
            reject(error)
        }
    })
}