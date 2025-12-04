import React, { useState } from 'react';
import { X, Tag, Percent, Calendar, Package, PackageCheck, Upload } from 'lucide-react';
import { ProductWithSales } from '@/services/api/products';
import { PromotionPayload, PromotionService } from '@/services/apiPromotions';

const PromotionDialog = ({ isOpen, onClose, products }: { isOpen: boolean; onClose: () => void; products: ProductWithSales[] }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const promotionService = new PromotionService()


    const [formData, setFormData] = useState({
        promotionType: 'individual', // 'individual' or 'all'
        selectedProducts: [] as string[],
        name: '',
        discount: '',
        startDate: '',
        endDate: '',
    });

    const closeDialog = () => {
        setStep(1);
        setFormData({
            promotionType: 'individual',
            selectedProducts: [],
            name: '',
            discount: '',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
        });
        onClose();
    }
    const handleProductToggle = (productId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedProducts: prev.selectedProducts.includes(productId)
                ? prev.selectedProducts.filter(id => id !== productId)
                : [...prev.selectedProducts, productId]
        }));
    };

    const handleSelectAll = () => {
        setFormData(prev => ({
            ...prev,
            selectedProducts: products.map(p => p.id)
        }));
    };

    const handleClearSelection = () => {
        setFormData(prev => ({
            ...prev,
            selectedProducts: []
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePromotionTypeChange = (type: string) => {
        setFormData(prev => ({
            ...prev,
            promotionType: type,
            selectedProducts: type === 'all' ? [] : prev.selectedProducts
        }));
    };

    const handleNext = () => {
        if (step === 1 && formData.promotionType === 'individual' && formData.selectedProducts.length === 0) {
            alert('Please select at least one product');
            return;
        }
        if (step === 2 && (!formData.name || !formData.discount)) {
            alert('Please fill in all required fields');
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = () => {
        const promotionData: PromotionPayload = {
            type: formData.promotionType,
            productIds: formData.promotionType === 'all'
                ? products.map(p => p.id)
                : formData.selectedProducts,
            name: formData.name,
            discount: Number(formData.discount),
            startDate: formData.startDate,
            endDate: formData.endDate,
        };


        // console.log('Promotion Data:', promotionData);
        try {
            setLoading(true);
            promotionService.createPromotion(promotionData);
        } catch (error) {
            setError('Failed to create promotion');
        } finally {
            setLoading(false);

            setTimeout(() => {
                closeDialog();
            }, 2000);
        }
        // Submit your data here
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Tag className="size-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Create Promotion
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="size-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6">

                    {/* Step 1: Product Selection */}
                    {step === 1 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                Select Products
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handlePromotionTypeChange('all')}
                                        className={`flex-1 py-3 px-4 rounded-lg border ${formData.promotionType === 'all' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        <PackageCheck className="size-5 mx-auto mb-2" />
                                        <div className="font-medium">All Products</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Apply to entire store
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handlePromotionTypeChange('individual')}
                                        className={`flex-1 py-3 px-4 rounded-lg border ${formData.promotionType === 'individual' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        <Package className="size-5 mx-auto mb-2" />
                                        <div className="font-medium">Select Products</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Choose specific items
                                        </div>
                                    </button>
                                </div>

                                {formData.promotionType === 'individual' && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Selected: {formData.selectedProducts.length} products
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSelectAll}
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    onClick={handleClearSelection}
                                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>

                                        <div className="max-h-60 overflow-y-auto space-y-2">
                                            {products.map(product => (
                                                <label
                                                    key={product.id}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selectedProducts.includes(product.id)}
                                                        onChange={() => handleProductToggle(product.id)}
                                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-800 dark:text-white">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            ${product.price}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Promotion Details */}
                    {step === 2 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                Promotion Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Promotion Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Summer Sale, Black Friday"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Discount Percentage
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="100"
                                            placeholder="10"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Duration */}
                    {step === 3 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                Promotion Duration
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={closeDialog}
                            className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            Cancel
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                            >
                                {loading ? 'Creating...' : 'Create Promotion'}
                                <Upload className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Example usage:
/*
const App = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const sampleProducts = [
    { id: '1', name: 'Premium T-Shirt', price: 29.99 },
    { id: '2', name: 'Wireless Headphones', price: 89.99 },
    { id: '3', name: 'Smart Watch', price: 199.99 },
    { id: '4', name: 'Laptop Backpack', price: 49.99 },
    { id: '5', name: 'Water Bottle', price: 24.99 },
  ];

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>
        Open Promotion Dialog
      </button>
      
      <PromotionDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        products={sampleProducts}
      />
    </div>
  );
};
*/

export default PromotionDialog;