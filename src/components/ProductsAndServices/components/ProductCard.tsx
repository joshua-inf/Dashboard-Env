import { getProductImages, ProductWithSales } from '@/services/api/products'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { CopyIcon, EditIcon, ImageIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { PiDotsThreeOutlineFill } from 'react-icons/pi'
import AddProductModal from './Dialog'

export const ProductCard = ({ e,getProducts }: { e: ProductWithSales, getProducts : ()=> void}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState(false)

    const getImages = () => {
        getProductImages(e.id, e.imageName)
            .then((res) => {
                console.log("images collected",res)
                if (res && res.length > 0) {
                    setImageUrl(res)
                }
            })
            .catch((err) => console.error(err))
    }
    useEffect(() => {
        getImages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="border border-gray-400 shadow-sm hover:shadow-lg duration-500 transition-ease relative flex gap-4 items-center  rounded-md">
                {/* Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex   absolute top-3 right-3 text-lg items-center">
                        <PiDotsThreeOutlineFill className="size-6 dark:text-gray-200" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white space-y-2 z-[99999999] shadow-md rounded-md dark:bg-boxdark">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="hover:bg-gray-100 p-3 cursor-pointer dark:hover:bg-gray-700 flex gap-2 text-gray-800 dark:text-gray-200"
                            onSelect={() => setOpenModal(true)}
                        >
                            <EditIcon /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-100 p-3 cursor-pointer dark:hover:bg-gray-700 flex gap-2 text-gray-800 dark:text-gray-200">
                            <TrashIcon /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Product Image */}
                <div>
                    {imageUrl ? (
                        <div
                            className="w-40 h-40 bg-cover "
                            style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }} // replace with your bg image
                        ></div>

                    ) : (
                        <div className="p-9 w-40 h-40 bg-[#EDF0F7] items-center flex  justify-center dark:bg-gray-700">
                            <ImageIcon className="size-[50px] dark:text-gray-200" />
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <div className="text-lg font-bold dark:text-gray-200">{e.name}</div>
                    <div className="text-[#1C0F86] dark:text-blue-400 font-bold text-md">
                        {'ZMK ' + e.price.toFixed(2)}
                    </div>
                    <div className="font-light text-sm dark:text-gray-400">
                        {e.sales.length} {e.sales.length > 1 ? 'Units' : 'Unit'} Sold
                    </div>
                </div>
            </div>

            {/* Modal (controlled by state) */}
            {openModal && (
                <AddProductModal
                    getProducts={() => getProducts()}
                    open={openModal}
                    data={e}
                    productImage={imageUrl}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </>
    )
}
