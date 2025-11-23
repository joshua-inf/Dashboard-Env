import React from 'react'
import { supabase } from '../SupabaseConfig'
import { Customers } from '@/types/Customers';


export type Order = ActualOrderType & {
    customers: {
        name: string;
        email: string;
        phone: string
    };
    products: {
        name: string;
        price: number
    }
};

export type ActualOrderType = {
    id: string;
    quantity: number;
    order_id: number;
    business_id: string;
    int_business_id: number;
    customer_id: string;
    int_customer_id: number;
    total_amount: number;
    order_status: string;
    created_at: string;
    delivery_location: string | null;
}

export type Product = {
    id: string;
    product_id: number;
    business_id: string;
    int_business_id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    created_at: string;
};

export type DashboardSummary = {
    allCustomers: Partial<Customers>[];
    GenderSales: {
        Salesbyfemale: number;
        Salesbymale: number;
    };
    GrowthRate: string; // Maybe change to number?
    Customers: string;  // Maybe change to number?
    TopSelling: {
        product: Product;
        amount: number;
        Orders: {
            allOrders: Order[];
        };
    }[];
    allSales: any[]; // Replace `any[]` with a proper type if known.
    OrderData: {
        allOrders: Order[];
    };
};

export function formatNumber(num: any): string {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + "M"; // for millions
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + "K"; // for thousands
    } else {
        return num.toString();
    }
}


export const dashboard = (business_id: string | null | undefined): Promise<DashboardSummary | null> => {
    let users : Partial<Customers>[] = []
    let products = []
    let allOrder = []

    let Salesbymale = 0
    let Salesbyfemale = 0

    let TopSelling = []

    return new Promise(async (resolve, reject) => {

        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('business_id', business_id)


            if (data) {
                users = data;
            }

            if (error) {

            }
        }
        catch (err) {
            reject(null)
        }

        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
    *,
    customers (
      name,
      email,
      phone
    ),
    products
  `)
                .eq('business_id', business_id)
                .eq('order_payment_status', 'completed')


            if (data) {
                allOrder.push(...data)
            }

            if (error) {

            }
        }
        catch (err) {
            reject(null)
        }


        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('business_id', business_id)


            if (data) {
                products.push(...data)
            }

            if (error) {

            }
        }
        catch (err) {
            reject(null)
        }


        for (let i = 0; i < users.length; i++) {
            if (users[i].gender == 'male') {
                let countSales = allOrder.filter((e) => e.customer_id == users[i].id).length

                Salesbymale += countSales
            }

            if (users[i].gender == 'female') {
                let countSales = allOrder.filter((e) => e.customer_id == users[i].id).length

                Salesbyfemale += countSales
            }
        }

        for (let i = 0; i < products.length; i++) {

            let currentProduct = products[i]
            let amountSold = allOrder.filter((e) => e.product_id == currentProduct.id).reduce((prev, curr) => prev + curr.total_amount, 0)

            TopSelling.push({
                product: currentProduct,
                amount: amountSold,
                Orders: { allOrders: allOrder }
            })
        }

        const getYear = (data: string) => {
            // Convert the string to a Date object
            const date = new Date(data);

            // Extract the year
            const year = date.getFullYear();
            return year
        }

        const currentYear = new Date().getFullYear();
        const prevYear = currentYear - 1;

        const amountforPrevYear = allOrder
            .filter((e) => getYear(e.created_at) === prevYear)
            .reduce((prev, curr) => prev + curr.total_amount, 0);

        const amountforCurrentYear = allOrder
            .filter((e) => getYear(e.created_at) === currentYear)
            .reduce((prev, curr) => prev + curr.total_amount, 0);

        let GrowthRate = 0;

        if (amountforPrevYear > 0) {
            GrowthRate = ((amountforCurrentYear - amountforPrevYear) / amountforPrevYear) * 100;
        } else if (amountforCurrentYear > 0) {
            // If previous year had no sales but current year has, consider it full growth.
            GrowthRate = 100;
        } else {
            // Both are zero, growth is zero
            GrowthRate = 0;
        }


        const getDay = (data: string) => {

            // Convert to Date object
            const date = new Date(data);

            // Get current day (day of month)
            return date.getDate();
        }

        const currentDate = new Date().getDate();
        const prevDate = currentDate - 1;

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);


        const sameDay = (a: Date, b: Date) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        const numberOfCustomerfromPrev = users.filter((e) =>
            e.created_at && sameDay(new Date(e.created_at), yesterday)
        ).length;

        const numberOfCustomers = users
            .filter((e) => e.created_at && sameDay(new Date(e.created_at), today))
            .length;

        let GrowthCustomerRate = 0;

        if (numberOfCustomerfromPrev > 0) {
            GrowthCustomerRate = ((numberOfCustomers - numberOfCustomerfromPrev) / numberOfCustomerfromPrev) * 100;
        } else if (numberOfCustomers > 0) {
            // If previous year had no sales but current year has, consider it full growth.
            GrowthCustomerRate = 100;
        } else {
            // Both are zero, growth is zero
            GrowthCustomerRate = 0;
        }





        resolve({
            GenderSales: { Salesbyfemale: Salesbyfemale, Salesbymale: Salesbymale },
            GrowthRate: GrowthRate.toFixed(2),
            Customers: GrowthCustomerRate.toFixed(2),
            allCustomers: users,
            TopSelling: TopSelling,
            allSales: allOrder,
            OrderData: { allOrders: allOrder }
        })
    })
}
