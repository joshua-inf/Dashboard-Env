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
import { ArrowRight } from "lucide-react"
import { ImagePreview, updateProductAndService } from "@/services/api/products"
import { getOrgData } from "@/lib/createCookie"
import { Product } from "@/types/product"
import { BusinessType } from "@/types/businesses"
import { updateBusiness } from "@/services/api/apiBusiness"

export const EditDiag = ({ isOpen, onClose, productImage, data, getBusinessByUserID }: { getBusinessByUserID: ()=> void ,isOpen: boolean, data: BusinessType | null, onClose: () => void, productImage: string | null }) => {
    const [selectedProduct, setSelectedProduct] = useState<BusinessType | null>(null)
    const [uploadDataLoading, setUploadDataLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState<ImagePreview | null>(null);
    const businessData = getOrgData() // Assuming this function returns the business data   
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

        let business_name = values.business_name
        business_name && (UpdateValues = { ...UpdateValues, business_name: business_name });


        let company_alias = values.company_alias
        company_alias && (UpdateValues = { ...UpdateValues, company_alias: company_alias });

        selectedImages && (UpdateValues = { ...UpdateValues, imageName: selectedImages?.name });



        if (data && typeof data.id === "string") {
            console.log("Updating business with ID:", data.id, UpdateValues);
            updateBusiness(UpdateValues, data.id, selectedImages)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setUploadDataLoading(false)
                    getBusinessByUserID()
                    onClose()
                })
        } else {
            console.error("Business data or ID is missing.");
            setUploadDataLoading(false);
            onClose();
        }


        // console.log("Form values:", UpdateValues);
    };

    return (

        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] dark:text-white overflow-y-auto z-[9999] bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">

                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-200">
                        Edit Business
                    </DialogTitle>
                    <DialogDescription className="text-gray-700 dark:text-gray-400">
                        Edit your Business details
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
                        </div>


                    </div>
                    {/* Example Input Field */}
                    <div>
                        <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Edit product business name</label>
                        <Input
                            placeholder={data?.business_name}
                            name="business_name"
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    {/* <div>
                        <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Edit product Industry</label>
                        <Input
                            placeholder={data?.industry}
                            name="price"
                            onChange={(e) =>
                                setSelectedProduct(
                                    data
                                        ? {
                                            ...data,
                                            industry: e.target.value,
                                        }
                                        : null
                                )
                            }
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div> */}

                    <div>
                        <label className='font-bold text-[#4B4F4F] dark:text-gray-300 text-sm'>Edit company_alias</label>
                        <Input
                            placeholder={data?.company_alias}
                            name="company_alias"
                            onChange={(e) =>
                                setSelectedProduct(
                                    data
                                        ? {
                                            ...data,
                                            company_alias: e.target.value,
                                            business_id: data.business_id ?? 0 // fallback to 0 or a valid number
                                        }
                                        : null
                                )
                            }
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                    {/* Submit Button */}
                    <div>
                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 grow bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={uploadDataLoading}
                                type="submit"
                                className="px-4 py-2 grow bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {uploadDataLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                </form>
            </DialogContent>
        </Dialog>

    )
}
