import React, { useEffect, useState } from 'react';
import {
    X,
    Clock,
    CheckCircle,
    AlertTriangle,
    BadgeCheck,
    ArrowLeft,
    Eye,
    Package,
    User,
    CreditCard,
    MapPin,
    Mail,
    Phone,
    ChevronDown,
    ImageIcon
} from 'lucide-react';
import { OrderData } from '@/types/Orders';
import { getProductById } from '@/services/apiProducts';
import { Product } from '@/types/product';
import { getOrderProductsImages } from '@/services/api/products';
import Image from 'next/image';

interface OrderDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderData | null;
    onMarkSettled: (orderId: string) => void;
    onCheckPaymentStatus: (transactionId: string, orderToken: string) => void;
    loading?: boolean;
    paymentCheckLoading?: boolean;
}

type DialogPage = 'main' | 'specifications' | 'products';

export const OrderDetailsDialog = ({
    isOpen,
    onClose,
    order,
    onMarkSettled,
    onCheckPaymentStatus,
    loading = false,
    paymentCheckLoading = false
}: OrderDetailsDialogProps) => {
    const [currentPage, setCurrentPage] = useState<DialogPage>('main');



    if (!isOpen || !order) return null;

    // Reset to main page when dialog closes
    const handleClose = () => {
        setCurrentPage('main');
        onClose();
    };

    // Header component
    const Header = () => (
        <div className='flex p-5 gap-10 sticky top-0 bg-gray-200 dark:bg-gray-800 justify-between items-center border-b border-gray-300 dark:border-gray-600'>
            <div className='flex gap-5 items-center'>
                {currentPage !== 'main' && (
                    <button
                        onClick={() => setCurrentPage('main')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                <div className='text-2xl text-gray-800 dark:text-gray-200 font-bold'>
                    {currentPage === 'main' && 'Order Details'}
                    {currentPage === 'specifications' && 'Customer Specifications'}
                    {currentPage === 'products' && 'Order Products'}
                </div>
            </div>

            <div className="text-white px-4 py-2 rounded-md flex items-center gap-3">
                {/* Order Status */}
                {order.order_payment_status !== 'pending' && (
                    <button className="bg-[#1A0670] text-white px-4 py-2 rounded-md flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            {order.order_status === 'Pending' ? (
                                <Clock className="size-4" />
                            ) : (
                                <CheckCircle className="size-4" />
                            )}
                            {order.order_status}
                        </span>
                    </button>
                )}

                {/* Payment Status */}
                <button
                    className={`px-4 py-2 rounded-md flex items-center gap-2 
                      ${order.order_payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}
                >
                    <span className="flex items-center gap-1">
                        {paymentCheckLoading ? (
                            <span>Loading...</span>
                        ) : (
                            <>
                                {order.order_payment_status === 'pending' ? (
                                    <>
                                        <AlertTriangle className="size-4" />
                                        <span>Not Paid</span>
                                    </>
                                ) : (
                                    <>
                                        <BadgeCheck className="size-4" />
                                        <span>Paid</span>
                                    </>
                                )}
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );

    // Main Details Page
    const MainDetailsPage = () => (
        <div className='mt-5 p-5 space-y-5'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="size-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Customer Name</p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                        {order.customers?.name || 'N/A'}
                    </p>
                </div>

                {/* Order ID */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Order ID</p>
                    <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                        #{order.order_id}
                    </p>
                </div>

                {/* Due Date */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Order Date</p>
                    <p className="text-gray-900 dark:text-gray-100">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Quantity */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="size-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Total Quantity</p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                        {order.products?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                    </p>
                </div>

                {/* Phone Number */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Phone className="size-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Phone Number</p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">
                        {order.customers?.phone || 'N/A'}
                    </p>
                </div>

                {/* Transaction Amount */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="size-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Transaction Amount</p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                        ZMW {order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                    </p>
                    {order.partialAmountTotal > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Partial: ZMW {order.partialAmountTotal.toFixed(2)}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="size-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Email</p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">
                        {order.customers?.email || 'N/A'}
                    </p>
                </div>

                {/* Address */}
                <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="size-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Delivery Address</p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">
                        {order.delivery_location || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <button
                    onClick={() => setCurrentPage('specifications')}
                    className="border-2  rounded-lg text-center p-3 font-semibold hover:bg-[#1A0670] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Eye className="size-4" />
                    View Specifications
                </button>

                <button
                    onClick={() => setCurrentPage('products')}
                    className=" border-2 rounded-lg text-center p-3 font-semibold hover:bg-[#1A0670] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Package className="size-4" />
                    View Products ({order.products?.length || 0})
                </button>
            </div>

            {/* Footer Actions */}
            <div className='mt-8 flex justify-end gap-3'>
                <button
                    onClick={handleClose}
                    className='border border-gray-500 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                    Close
                </button>

                {order.order_status === 'completed' ? (
                    <button
                        disabled
                        className="bg-[#1A0670] opacity-50 text-white px-6 py-2 rounded-md flex items-center gap-2 cursor-not-allowed"
                    >
                        <CheckCircle className="size-4" />
                        Completed
                    </button>
                ) : (
                    <>
                        {order.order_payment_status === 'completed' ? (
                            <button
                                disabled={loading}
                                onClick={() => onMarkSettled(order.id)}
                                className="bg-[#1A0670] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#150552] transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="size-4" />
                                {loading ? 'Processing...' : 'Mark Settled'}
                            </button>
                        ) : (
                            <button
                                disabled={paymentCheckLoading}
                                onClick={() => onCheckPaymentStatus(order.transaction_id, order.orderToken)}
                                className={`bg-[#1A0670] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#150552] transition-colors ${paymentCheckLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {paymentCheckLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="size-4" />
                                        Check Payment Status
                                    </>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    // Specifications Page
    const SpecificationsPage = () => (
        <div className="p-6 space-y-6">
            {/* Summarized Notes */}
            <div className="p-6 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Eye className="size-5" />
                    Summarized Notes from Customer
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                        {order.sammarized_notes || "No notes provided by the customer."}
                    </p>
                </div>
            </div>

            {/* Images from Customer */}
            <div className="p-6 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Images from the Customer
                </h3>
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {/* Replace ImageComp with your actual image component */}
                    <div className="flex gap-4">
                        {/* Placeholder for images - replace with your ImageComp component */}
                        <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">No images</span>
                        </div>
                        {/* Add more image placeholders or your ImageComp component */}
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-start">
                <button
                    onClick={() => setCurrentPage('main')}
                    className="border px-6 py-2 rounded-md hover:bg-[#1A0670] hover:text-white transition-colors"
                >
                    Back to Main Details
                </button>
            </div>
        </div>
    );


    const ProductName = ({ products }: { products: { quantity: number, product_id: string, specialInstructions: string, description: string } }) => {
        const [product, setProduct] = useState<Partial<Product> | null>(null)
        const [isOpen, setIsOpen] = useState(false)

        useEffect(() => {
            const getProdDetails = async () => {
                let response = await getProductById(products.product_id)
                setProduct(response)
            }
            getProdDetails()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const ImageView = ({ orderId, productID }: { orderId: string; productID: string }) => {
            const [imageUrl, setImageUrl] = useState<string | null>(null);

            useEffect(() => {
                const getImages = async () => {
                    try {
                        const urls = await getOrderProductsImages(orderId, productID);
                        console.log("images collected", urls);
                        if (urls.length > 0) {
                            setImageUrl(urls[0]); // show the first image
                        }
                    } catch (err) {
                        console.error(err);
                    }
                };

                getImages();
            }, [orderId, productID]);

            return (
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={`Product ${productID}`}
                            width={150}
                            height={150}
                            className=""
                        />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                </div>
            );
        };
        return (
            <>
                <div
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                {product?.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Quantity: {products.quantity}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                Active
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Accordion Content */}
                    {isOpen && product && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Product Image */}
                                <div className="flex justify-center">
                                    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                        <ImageView orderId={order.id} productID={products.product_id} />
                                    </div>
                                </div>

                                {/* Details Section 1 */}
                                <div className="space-y-3">
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                        Product Details
                                    </h5>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                ZMW {product.price?.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {product.category || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Special Instructions:</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {products.specialInstructions || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Section 2 */}
                                <div className="space-y-3">
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                        Additional Information
                                    </h5>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Stock:</span>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {products.quantity || 0} units
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            {product.description && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                                        Description
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
        )
    }


    // Products Page
    const ProductsPage = () => (
        <div className="p-6 space-y-6">
            <div className="p-6 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="size-5" />
                    Order Products ({order.products?.length || 0})
                </h3>

                {order.products && order.products.length > 0 ? (
                    <div className="space-y-4">
                        {order.products.map((product, index) => (
                            <ProductName key={index} products={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Package className="size-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No products found for this order.</p>
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="p-6 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h4>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {order.products?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            ZMW {order.total_amount?.toFixed(2) || '0.00'}
                        </span>
                    </div>
                    {order.partialAmountTotal > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Partial Amount:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                ZMW {order.partialAmountTotal.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-start">
                <button
                    onClick={() => setCurrentPage('main')}
                    className=" border px-6 py-2 rounded-md hover:bg-[#1A0670] hover:text-white transition-colors"
                >
                    Back to Main Details
                </button>
            </div>
        </div>
    );

    // Render current page
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'main':
                return <MainDetailsPage />;
            case 'specifications':
                return <SpecificationsPage />;
            case 'products':
                return <ProductsPage />;
            default:
                return <MainDetailsPage />;
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-[999]">
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
                <Header />
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {renderCurrentPage()}
                </div>
            </div>
        </div>
    );
};