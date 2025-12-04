import { getProductImages, ProductWithSales } from '@/services/api/products'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { CopyIcon, EditIcon, ImageIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { PiDotsThreeOutlineFill } from 'react-icons/pi'
import AddProductModal from './Dialog'
import { PromotionService } from '@/services/apiPromotions'

export const ProductCard = ({ e, getProducts }: { e: ProductWithSales, getProducts: () => void }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const promoService = new PromotionService();
    const [promoInfo, setPromoInfo] = useState<{
        hasPromotion: boolean,
        discount: number,
        percentage: number,
        finalPrice: number
    } | null>(null)

    const getProductPromotion = async (productId: string, price: number) => {
        const promo = await promoService.getActivePromotionForProduct(productId);

        if (!promo) {
            return {
                hasPromotion: false,
                discount: 0,
                percentage: 0,
                finalPrice: price,
            };
        }

        const percentage = promo.discount;
        const discount = (price * percentage) / 100;
        const finalPrice = price - discount;

        return {
            hasPromotion: true,
            discount,
            percentage,
            finalPrice,
            promo,
        };
    }

    const getImages = () => {
        getProductImages(e?.id, e?.imageName)
            .then((res) => {
                console.log("images collected", res)
                if (res && res.length > 0) {
                    setImageUrl(res)
                }
            })
            .catch((err) => console.error(err))
    }
    useEffect(() => {
        getImages()

        getProductPromotion(e.id, e.price)
            .then((res) => {
                setPromoInfo(res)
            })
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

                <div className="mt-1">

                    {promoInfo?.hasPromotion ? (
                        <>
                            <div className="text-red-600 font-bold text-md">
                                {promoInfo.percentage}% OFF
                            </div>

                            <div className="flex gap-2 items-center">
                                <div className="text-gray-400 line-through text-sm">
                                    ZMK {e?.price.toFixed(2)}
                                </div>
                                <div className="text-green-600 font-bold text-lg">
                                    ZMK {promoInfo.finalPrice.toFixed(2)}
                                </div>
                            </div>

                            <div className="text-xs text-gray-400">
                                You save ZMK {promoInfo.discount.toFixed(2)}
                            </div>
                        </>
                    ) : (
                        <div className="text-[#1C0F86] dark:text-blue-400 font-bold text-md">
                            ZMK {e?.price.toFixed(2)}
                        </div>
                    )}

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
