import { CartItem } from "@/components/pos/Pos";
import { UsersType } from "@/types/Customers";
import { createCustomer, getCustomersById } from "../apiCustomers";
import { businessType } from "@/types/businesses";
import { createOrder } from "../api/apiOrder";



export const makeOrderByMainUser = async (Payload: CartItem[], user?: Partial<UsersType>, business_id?:string) => {
    let userData = await getCustomersById(user?.id)
    let userID = userData.id

    if (!userData) {
        //function to create the said user
        console.log("user is being saved as a customer....")
        let response = await createCustomer(user)

        if (response) {
            userID = response.id
            console.log("user has been created successfully")
        }
    }


    let totalamount = 0
    let products = []

    for (let i = 0; i < Payload.length; i++) {
        products.push({ product_id: Payload[i].product.id, quantity: Payload[i].quantity })

        totalamount += Payload[i].subtotal
    }

    console.log("data being sent to create order:")
    console.log(user)
    
    let newOrder = {
        business_id: business_id,
        customer_id: userID,
        order_payment_status: "completed",
        total_amount: totalamount,
        delivery_location: "onsight",
        order_status: "completed",
        products: products,
        partialAmountTotal: 0
    }

    let orderCreateResponse = await createOrder(newOrder)

    if (orderCreateResponse) {
        return orderCreateResponse
    } else {
        return false
    }
}