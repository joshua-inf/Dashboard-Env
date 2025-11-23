import { inventoryData, InventoryResponse } from "@/types/inventoryTypes"
import { supabase } from "../SupabaseConfig"
import { get } from "http";

export const getInventory = async (businessid: string | undefined | null) => {
    let allproducts: any[] = []
    let allInventory: any[] = []


    return new Promise(async (resolve, reject) => {

        try{
            const {data, error} = await supabase
            .from('products')
            .select(
                `
                name,
                category,
                price,
                orders(*),
                stock_table(*)
                `
            )
            .eq('business_id', businessid)

            if(data){
                // console.log('stock data, :', data)
                allInventory = data;
            }

            if(error)[
                console.log(error)
            ]

        } catch {
             reject("Error fetching inventory")
        }

       

        // now to fillter out the data needed
        let inventoryWithProducts: any[] = []

        for(let i = 0; i < allproducts.length; i++){
            const inventoryItem = allInventory[i];


            const productDetails = allInventory.filter((product) => product.id === inventoryItem.product_id);

            let totalQuantity = productDetails.reduce((acc, curr) => acc + curr.quantity, 0);

            inventoryWithProducts.push({
                ...inventoryItem,
                quantity: totalQuantity
            })
        }




        


        resolve({
            allInventory: allInventory
        })
    }


    )
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