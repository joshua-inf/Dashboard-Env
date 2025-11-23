"use client";
import { getOrgData } from '@/lib/createCookie';
import { createMulitipleProductsandservices } from '@/services/api/products';
import React, { useState, useCallback } from 'react';

export type Product = {
    name: string | null;
    price: number | null;
    category: string | null;
    description: string | null;
    imageUrl: string;
    file: File;
};
export type ProductAi = Product;

interface AIUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    getProduct: () => void
}

export type ProductAIResponse = {
    imageUrl: string;
    ai: {
        name: string | null;
        category: string | null;
        price: number | null;
        description: string | null;
    };
};

type UploadItem = {
    file: File;
    id: string;
    previewUrl: string;
};

const AIUploadModal: React.FC<AIUploadModalProps> = ({ isOpen, onClose, getProduct }) => {
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success'
    const [products, setProducts] = useState<Product[]>([]);
    const [step, setStep] = useState<'upload' | 'review'>('upload');
    const [error, setError] = useState<string | null>(null);
    const businessData = getOrgData()

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newUploads: UploadItem[] = Array.from(files).map((file) => ({
            file,
            id: Math.random().toString(36).substring(7),
            previewUrl: URL.createObjectURL(file),
        }));

        setUploads((prev) => [...prev, ...newUploads]);
        setError(null);
    };

    const handleRemoveImage = (id: string) => {
        setUploads((prev) => prev.filter((item) => item.id !== id));
    };

    const handleUpload = useCallback(async () => {
        if (uploads.length === 0) return;

        setIsUploading(true);
        setError(null);
        setStatus('loading'); // Add this line

        try {
            const formData = new FormData();
            uploads.forEach((item) => {
                formData.append("files", item.file);
            });

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Upload failed with status: ${res.status}`);
            }

            const data: { results: ProductAIResponse[] } = await res.json();

            setProducts(
                data.results.map((r: ProductAIResponse, index) => ({
                    imageUrl: r.imageUrl,
                    ...r.ai,
                    file: uploads[index].file
                }))
            );
            setStep('review');
            setStatus('idle'); // Reset status to idle when moving to review step

        } catch (err) {
            console.error(err);
            setError("Failed to process images. Please try again.");
            setStatus('idle'); // Reset status on error
        } finally {
            setIsUploading(false);
        }
    }, [uploads]);

    const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
        setProducts((prev) => {
            const newProducts = [...prev];
            newProducts[index] = { ...newProducts[index], [field]: value };
            return newProducts;
        });
    };

    const handleReset = () => {
        setUploads([]);
        setProducts([]);
        setStep('upload');
        setError(null);
        setStatus('idle'); // Reset status to idle
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleSaveProducts = async () => {
        setStatus('loading');
        try {
            let resp = await createMulitipleProductsandservices(products, businessData);

            if (resp) {
                setStatus('success');
                getProduct()
                // Keep products in state for success message
            } else {
                setStatus('idle');
                setError('Failed to save products. Please try again.');
            }
        } catch (error) {
            console.log("Failed to save products", error);
            setStatus('idle');
            setError('An error occurred while saving products.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {status === 'success' ? 'Products Saved!' :
                                step === 'upload' ? 'Upload with AI' : 'Review Products'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {status === 'success' ? 'Your products have been successfully saved' :
                                step === 'upload'
                                    ? 'Upload an image to automatically generate product listings'
                                    : 'Review and edit the generated products before saving'
                            }
                        </p>
                    </div>
                    {status !== 'loading' && (
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto flex-grow">
                    {/* Loading State */}
                    {status === 'loading' && (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Processing Your Images
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center">
                                Our AI is analyzing your images and generating product listings...
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Products Saved Successfully!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                {products.length} product{products.length !== 1 ? 's' : ''} have been added to your store.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Add More Products
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    View Products
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Upload Step */}
                    {status === 'idle' && step === 'upload' && (
                        <div className="p-6">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer block">
                                    {uploads.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* GRID OF THUMBNAILS */}
                                            <div className="grid grid-cols-3 gap-4">
                                                {uploads.map((item) => (
                                                    <div key={item.id} className="relative group">
                                                        <img
                                                            src={item.previewUrl}
                                                            alt="preview"
                                                            className="w-full h-32 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRemoveImage(item.id);
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                                Click to add more images
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Drop your images here
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    or click to browse files
                                                </p>
                                            </div>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Supports JPG, PNG, WEBP • Max 10MB each
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Upload Button */}
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploads.length === 0 || isUploading}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${uploads.length === 0 || isUploading
                                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Analyze Image & Generate Products
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Review Step */}
                    {status === 'idle' && step === 'review' && (
                        <div className="p-6">
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
                                    >
                                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex-shrink-0 relative">
                                            <img
                                                src={product.imageUrl || "/placeholder.png"}
                                                alt={product.name || "Product"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={product.name || ""}
                                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                                    placeholder="Product Name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1.5 text-gray-500 dark:text-gray-400 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        value={product.price || ""}
                                                        onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                                                        className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    value={product.category || ""}
                                                    onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                                    placeholder="Category"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                                <textarea
                                                    value={product.description || ""}
                                                    onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                                    rows={3}
                                                    placeholder="Product description..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    Upload Different Image
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProducts}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Save All Products
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIUploadModal;