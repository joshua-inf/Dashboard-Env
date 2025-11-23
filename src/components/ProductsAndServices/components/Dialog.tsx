import { useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePreview, ProductWithSales, updateProductAndService } from "@/services/api/products"
import { getOrgData } from "@/lib/createCookie"
import { Product } from "@/types/product"
import { ArrowRight } from "lucide-react"

export default function AddProductModal({
    open,
    onClose,
    productImage,
    data,
    getProducts
}: {
    open: boolean
    onClose: () => void
    productImage: string | null
    data: ProductWithSales
    getProducts: () => void
}) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [uploadDataLoading, setUploadDataLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState<ImagePreview | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<null | File>()

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // programmatically click input
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;

        const newImage: ImagePreview = {
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        };

        setSelectedImages(newImage);
        console.log("Selected image:", newImage);

        event.target.value = ""; // reset input
    };

    const submitUpdateForm = (e: React.FormEvent<HTMLFormElement>) => {
        setUploadDataLoading(true)
        e.preventDefault(); // don't reload page

        const formData = new FormData(e.currentTarget); // grab all form fields

        // Convert to object
        const values = Object.fromEntries(formData.entries());

        let UpdateValues = {};

        let name = values.name
        name && (UpdateValues = { ...UpdateValues, name: name });

        let partialPayment = values.partialPayment
        partialPayment && (UpdateValues = { ...UpdateValues, partialPayment: partialPayment });

        let price = values.price
        price && (UpdateValues = { ...UpdateValues, price: price });

        UpdateValues = { ...UpdateValues, imageName: selectedImages?.name }



        updateProductAndService(UpdateValues, data.id, selectedImages)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setUploadDataLoading(false)
                getProducts()
                onClose()
            })


        // console.log("Form values:", UpdateValues);
    };

    useEffect(() => {
        if (!open) {
            // Reset form when modal closes
            setSelectedProduct(null)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto z-[9999] bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-200">
                        Edit Product/Service
                    </DialogTitle>
                    <DialogDescription className="text-gray-700 dark:text-gray-400">
                        Edit your product details
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitUpdateForm} className="grid gap-4 py-4">
                    <div onClick={handleClick} className="flex cursor-pointer gap-4  hover:opacity-80 transition items-center justify-between">
                        <div

                            className="bg-center p-3 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center  "
                            style={{ backgroundImage: `url('/your-image.jpg')` }} // replace with your bg image
                        >
                            {
                                productImage ?
                                    <div
                                        className="w-40 h-40 bg-cover "
                                        style={{ backgroundImage: productImage ? `url(${productImage})` : undefined }} // replace with your bg image
                                    ></div>
                                    :

                                    <span className="text-gray-700 dark:text-gray-300">Click to Upload</span>

                            }
                            {/* Hidden input */}
                            <input
                                type="file"
                                name="image"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>

                        <ArrowRight className="text-gray-400" />

                        <div
                            className="bg-center p-3 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center "

                        >
                            <div
                                className="w-40 h-40 bg-cover "
                                style={{ backgroundImage: selectedImages ? `url(${selectedImages.url})` : undefined }} // replace with your bg image
                            ></div>

                            {/* Hidden input */}

                        </div>
                    </div>
                    {/* Example Input Field */}
                    <div>
                        <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Edit product name</label>
                        <Input
                            placeholder={data.name}
                            name="name"
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div>
                        <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Edit product Price</label>
                        <Input
                            placeholder={data.price.toString()}
                            name="price"
                            onChange={(e) =>
                                setSelectedProduct({ ...data, name: e.target.value })
                            }
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div>
                        <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Edit product Partial Payment</label>
                        <Input
                            placeholder={data.partialPayment}
                            name="partialPayment"
                            onChange={(e) =>
                                setSelectedProduct({ ...data, name: e.target.value })
                            }
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        disabled={uploadDataLoading}
                        className="bg-blue-600 text-white"
                        type="submit"
                    >
                        {uploadDataLoading ? "Saving..." : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}