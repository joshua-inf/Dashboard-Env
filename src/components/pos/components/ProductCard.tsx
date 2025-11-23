import { Product } from '@/types/product'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'

export const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (data: Product) => void }) => {
    const [stock, setStock] = useState(0)


    const getProductStock = () => {

    }
    return (
        <div
            key={product.id}
            className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-700"
            onClick={() => addToCart(product)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    K{product.price.toFixed(2)}
                </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    Stock:
                </span>
                <button className="p-2 bg-blue-500/20 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
