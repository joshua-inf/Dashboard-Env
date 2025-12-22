import { useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createProductAndService, ImagePreview, ProductWithSales } from "@/services/api/products"
import { getOrgData } from "@/lib/createCookie"
import { PhotoIcon } from "@heroicons/react/24/outline"

export default function UploadDialog({
    open,
    onClose,
    getProducts
}: {
    open: boolean
    onClose: () => void,
    getProducts: () => void
}) {
    const businessData = getOrgData() // Assuming this function returns the business data   
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading2, setLoading2] = useState(false)
    const [selectedImages, setSelectedImages] = useState<ImagePreview | null>(null);



    const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading2(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const category = formData.get('category') as string;
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const descriptions = formData.get('description') as string;

        // this section gets the partial payment defined by the user
        const partialPayment = parseFloat(formData.get('partialPayment') as string);

        const staticData = {
            price,
            name,
            imageName: selectedImages?.name,
            category,
            description: descriptions || "",
            business_id: businessData?.id || "",
            int_business_id: businessData?.business_id || 0,
            partialPayment: partialPayment ? partialPayment : price * 0.3, // default to 30% of the price if not provided
        };

        try {
            const createdProduct = await createProductAndService(staticData, selectedImages);

            if (createdProduct) {
                // If images were uploaded successfully, reset the selected images
                setSelectedImages(null);
                alert("Product/Service added successfully!");
            } else {
                alert("Failed to add product/service. Please try again.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            getProducts();
            setLoading2(false);
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

    const handleDivClick = () => {

        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const options = [
        "Agriculture",
        "Manufacturing",
        "Retail",
        "Wholesale",
        "Food & Beverage",
        "Hospitality",
        "Tourism & Travel",
        "Transportation & Logistics",
        "Technology & Software",
        "Telecommunications",
        "Construction",
        "Real Estate",
        "Finance & Banking",
        "Loans & Microfinance",
        "Insurance",
        "Healthcare & Pharmaceuticals",
        "Education & Training",
        "Media & Entertainment",
        "Fashion & Apparel",
        "Beauty & Personal Care",
        "Sports & Recreation",
        "Energy & Utilities",
        "Mining & Metals",
        "Professional Services",
        "Legal Services",
        "Consulting",
        "Nonprofit & NGOs",
        "Government & Public Sector",
        "E-commerce",
        "Automotive",
        "Home & Living"
    ];


    return (
        <Dialog open={open} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-200">
                        Add Product/Service
                    </DialogTitle>
                    <DialogDescription className="text-gray-700 dark:text-gray-400">
                        Add your product details
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={addProduct} className='flex flex-col gap-4'>
                    <div className="space-y-4">

                        {/* Upload trigger div */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div
                            onClick={handleDivClick}
                            className="bg-cover bg-center rounded-xl border-2 border-dashed border-gray-400 p-6 w-full flex items-center justify-center"
                        >
                            {
                                selectedImages ?
                                    <>
                                        <div
                                            className="w-40 h-40 bg-cover "
                                            style={{ backgroundImage: selectedImages ? `url(${selectedImages.url})` : undefined }} // replace with your bg image
                                        ></div>

                                    </>
                                    :
                                    <PhotoIcon className="w-[30px] dark:text-gray-200" />
                            }

                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-1'>
                            <label
                                htmlFor="productSelect"
                                className="font-bold text-[#4B4F4F] dark:text-gray-300 text-sm"
                            >
                                Product/Service
                            </label>
                            <select
                                id="productSelect"
                                name='category'
                                required
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                {options.map((option, index) => (
                                    <option key={index} value={option} className="dark:text-gray-200">
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Enter Product/Service Name</label>
                            <Input required name='name' type='text' className="dark:bg-gray-700 dark:text-gray-200" />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Enter the Selling Price</label>
                            <Input required name='price' type='number' className="dark:bg-gray-700 dark:text-gray-200" />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Enter the Partial Payment Price</label>
                            <label className='font-bold text-[#4B4F4F] dark:text-gray-400 text-[10px]'>this is the amount a client is requested to pay upon when the order is placed.(optioanl but 30% of Selling price by default)</label>
                            <Input placeholder='default amount' name='partialPayment' type='number' className="dark:bg-gray-700 dark:text-gray-200" />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Describe the Product/Service Briefly (Optional)</label>
                            <Input name='description' type='textarea' className="dark:bg-gray-700 dark:text-gray-200" />
                        </div>
                    </div>

                    <div className='flex gap-3 justify-end'>
                        <button type='button' onClick={() => onClose()} className='border py-2 rounded-[100px] border-[#B9B9B9] text-[#B9B9B9] dark:border-gray-600 dark:text-gray-400 px-4'>Cancel</button>
                        <button disabled={loading2} type='submit' className='bg-[#1C0F86] py-2 rounded-[100px] text-white px-4'>
                            {
                                loading2 ? <span className='animate-spin'>Loading...</span> :
                                    <span>Finish</span>
                            }
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
