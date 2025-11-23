
import { CardProps } from '@/types/cards'
import React from 'react'

export const Card :React.FC<CardProps>  = ({ title, value, description, className }) => {
    const date = new Date().getFullYear()
    return (
        <div
            className={`bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between ${className}`}
        >
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {description && (
                <p className="text-gray-400 text-xs mt-1">{description}</p>
            )}
        </div>

    )
}
