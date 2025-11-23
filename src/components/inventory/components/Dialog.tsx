import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getProductsAndServices } from "@/services/api/products"
import { getOrgData } from "@/lib/createCookie"
import { addInventory } from "@/services/api/apiinventory"
import { Product } from "@/types/product"
import { inventoryData } from "@/types/inventoryTypes"

export default function AddProductModal({ getInventoryData, data }: { getInventoryData: () => void, data: inventoryData[] }) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([])
    const [uploadDAtaLoading, setUploadDataLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const businessData = getOrgData() // Assuming this function returns the business data   
    const [form, setForm] = useState({
        name: "",
        quantity: "",
        price: "",
    })



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // console.log("Product added:", form)
        // console.log("Selected Product:", selectedProduct)
        AddInventory()
        setForm({ name: "", quantity: "", price: "" }) // Reset form after submission
        setSelectedProduct(null) // Reset selected product
        // ✅ here you can call your API to add stock
    }


    const getAllProducts = () => {
        getProductsAndServices(businessData?.id)
            .then((res) => {
                // console.log("Products fetched:", res)
                setProducts(res)
            })
            .catch((err) => {
                console.error("Error fetching products:", err)
            })
    }

    const AddInventory = async () => {
        setUploadDataLoading(true)
        let inventoryData = {
            product_id: selectedProduct?.id,
            quantity: parseInt(form.quantity),
            business_id: businessData?.id,
        }
        addInventory(inventoryData)
            .then((res) => {
                console.log("Inventory added:", res)
                getInventoryData()
                setOpen(false)
            })
            .catch((err) => {
                console.error("Error adding inventory:", err)
            })
            .finally(() => {
                setUploadDataLoading(false)
            })

    }

    useEffect(() => {
        // Reset form when modal is closed)
        getAllProducts()
        
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [])

    return (
        <Dialog open={open} >
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className="bg-blue-600 text-white">+ Add Product</Button>
            </DialogTrigger>

            {
                data.length > 0 ?
                    <DialogContent className="sm:max-w-[500px] bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-gray-200">
                                Add New Product
                            </DialogTitle>
                            <DialogDescription className="text-gray-700 dark:text-gray-400">
                                Enter details below to add a new product to your inventory.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                                    Product Name
                                </label>
                                <select
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={(e) => {
                                        handleChange(e);
                                        const selected = products.find(product => product.name === e.target.value);
                                        setSelectedProduct(selected ?? {} as Product);
                                    }}
                                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                                    required
                                >
                                    <option value="" disabled>
                                        Select a product
                                    </option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.name}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="grid gap-2">
                                <label htmlFor="quantity" className="text-gray-700 dark:text-gray-300">Quantity</label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    className="text-white dark:text-gray-200"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="e.g. 100"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setOpen(false)} disabled={uploadDAtaLoading} type="button" className="bg-gray-600 grow text-white hover:bg-gray-700">
                                    close
                                </Button>
                                <Button disabled={uploadDAtaLoading} type="submit" className="bg-green-600 grow text-white hover:bg-green-700">
                                    {
                                        uploadDAtaLoading ?
                                            <>
                                                <div className="flex justify-center items-center py-5">
                                                    <div className="size-4 border-4 border-white border-dashed rounded-full animate-spin"></div>
                                                </div>
                                                <i>Adding Stock</i>
                                            </>
                                            : "Add Stock"
                                    }
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                    :
                    <DialogContent className="sm:max-w-[500px] bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-gray-200">
                                No Products created
                            </DialogTitle>
                            <DialogDescription className="text-gray-700 dark:text-gray-400">
                                for you to add stock for your business you first actually have stock.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setOpen(false)} disabled={uploadDAtaLoading} type="button" className="bg-gray-600 grow text-white hover:bg-gray-700">
                            close
                        </Button>
                    </DialogContent>
            }

        </Dialog>
    )
}
