import { CartItem } from "@/components/pos/Pos";
import { UsersType } from "@/types/Customers";
import { createCustomer, getCustomersById } from "../apiCustomers";
import { businessType } from "@/types/businesses";
import { createOrder } from "../api/apiOrder";



export const makeOrderByMainUser = async (Payload: CartItem[], user?: Partial<UsersType>, business_id?: string) => {
    console.log("payable uiser: ", user)
    let userData = await getCustomersById(user?.id)
    let userID = userData?.id

    if (!userData) {
        //function to create the said user
        let response = await createCustomer(user)

        if (response) {
            userID = response.id
        }
    }

    let totalamount = 0
    let products = []

    for (let i = 0; i < Payload.length; i++) {
        products.push({ product_id: Payload[i].product.id, quantity: Payload[i].quantity })

        totalamount += Payload[i].subtotal
    }

    if (userID) {
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
            console.log("failed to save order")
            return false
        }
    } else {
        console.log("user Id not found")
        return false
    }
}