import React, { useState, useCallback, useEffect } from 'react';
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

// Reusable Info Card Component
const InfoCard = ({
    icon: Icon,
    title,
    value,
    subValue
}: {
    icon: React.ComponentType<any>;
    title: string;
    value: string | number;
    subValue?: string;
}) => (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-400">{title}</p>
        </div>
        <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
            {value || 'N/A'}
        </p>
        {subValue && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subValue}
            </p>
        )}
    </div>
);

// Status Badge Component
const StatusBadge = ({
    status,
    type,
    loading = false
}: {
    status: string;
    type: 'order' | 'payment';
    loading?: boolean;
}) => {
    const getStatusConfig = () => {
        if (type === 'payment') {
            return {
                pending: {
                    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
                    text: 'text-yellow-800 dark:text-yellow-400',
                    icon: AlertTriangle,
                    label: 'Not Paid'
                },
                paid: {
                    bg: 'bg-green-100 dark:bg-green-900/20',
                    text: 'text-green-800 dark:text-green-400',
                    icon: BadgeCheck,
                    label: 'Paid'
                },
                completed: {
                    bg: 'bg-green-100 dark:bg-green-900/20',
                    text: 'text-green-800 dark:text-green-400',
                    icon: BadgeCheck,
                    label: 'Paid'
                }
            }[status] || {
                bg: 'bg-gray-100 dark:bg-gray-700',
                text: 'text-gray-800 dark:text-gray-300',
                icon: Clock,
                label: status
            };
        }

        // Order status
        return {
            pending: {
                bg: 'bg-blue-100 dark:bg-blue-900/20',
                text: 'text-blue-800 dark:text-blue-400',
                icon: Clock,
                label: 'Pending'
            },
            completed: {
                bg: 'bg-green-100 dark:bg-green-900/20',
                text: 'text-green-800 dark:text-green-400',
                icon: CheckCircle,
                label: 'Completed'
            },
            complete: {
                bg: 'bg-green-100 dark:bg-green-900/20',
                text: 'text-green-800 dark:text-green-400',
                icon: CheckCircle,
                label: 'Complete'
            }
        }[status] || {
            bg: 'bg-gray-100 dark:bg-gray-700',
            text: 'text-gray-800 dark:text-gray-300',
            icon: Clock,
            label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    if (loading) {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-4 h-4" />
            {config.label}
        </span>
    );
};

// Product Image Component
const ProductImageView = ({ orderId, productId }: { orderId: string; productId: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const urls = await getOrderProductsImages(orderId, productId);
                if (urls.length > 0) {
                    setImageUrl(urls[0]);
                }
            } catch (err) {
                console.error('Error fetching product images:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [orderId, productId]);

    if (loading) {
        return (
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-xs text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!imageUrl) {
        return (
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
                src={imageUrl}
                alt={`Product ${productId}`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

// Product Accordion Component
const ProductAccordion = ({
    productItem,
    orderId
}: {
    productItem: { quantity: number; product_id: string; specialInstructions: string; description: string };
    orderId: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState<Partial<Product> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchProductDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getProductById(productItem.product_id);
            setProduct(response);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    }, [productItem.product_id]);

    useEffect(() => {
        if (isOpen && !product) {
            fetchProductDetails();
        }
    }, [isOpen, product, fetchProductDetails]);

    return (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 text-left flex justify-between items-center"
            >
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                        {loading ? 'Loading...' : product?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Quantity: {productItem.quantity}
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
            </button>

            {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex justify-center">
                                <ProductImageView
                                    orderId={orderId}
                                    productId={productItem.product_id}
                                />
                            </div>

                            <div className="space-y-3">
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                    Product Details
                                </h5>
                                <div className="space-y-2">
                                    <InfoField label="Price" value={`ZMW ${product?.price?.toFixed(2) || '0.00'}`} />
                                    <InfoField label="Category" value={product?.category || 'N/A'} />
                                    <InfoField
                                        label="Special Instructions"
                                        value={productItem.specialInstructions || 'N/A'}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                    Additional Information
                                </h5>
                                <div className="space-y-2">
                                    <InfoField label="Stock" value={`${productItem.quantity} units`} />
                                </div>
                            </div>
                        </div>
                    )}

                    {product?.description && (
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
    );
};

// Helper component for info fields
const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}:</span>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
);

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
    isOpen,
    onClose,
    order,
    onMarkSettled,
    onCheckPaymentStatus,
    loading = false,
    paymentCheckLoading = false
}) => {
    const [currentPage, setCurrentPage] = useState<DialogPage>('main');

    const handleClose = useCallback(() => {
        setCurrentPage('main');
        onClose();
    }, [onClose]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleClose]);

    if (!isOpen || !order) return null;

    const Header = () => (
        <div className="flex p-6 gap-6 sticky top-0 bg-white dark:bg-gray-800 justify-between items-center border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="flex gap-4 items-center">
                {currentPage !== 'main' && (
                    <button
                        onClick={() => setCurrentPage('main')}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {currentPage === 'main' && 'Order Details'}
                    {currentPage === 'specifications' && 'Customer Specifications'}
                    {currentPage === 'products' && 'Order Products'}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <StatusBadge status={order.order_status} type="order" />
                <StatusBadge
                    status={order.order_payment_status}
                    type="payment"
                    loading={paymentCheckLoading}
                />
            </div>
        </div>
    );

    const MainDetailsPage = () => (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard
                    icon={User}
                    title="Customer Name"
                    value={order.customers?.name || 'N/A'}
                />
                <InfoCard
                    icon={CreditCard}
                    title="Order ID"
                    value={`#${order.order_id}`}
                />
                <InfoCard
                    icon={Clock}
                    title="Order Date"
                    value={new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                />
                <InfoCard
                    icon={Package}
                    title="Total Quantity"
                    value={order.products?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                />
                <InfoCard
                    icon={Phone}
                    title="Phone Number"
                    value={order.customers?.phone || 'N/A'}
                />
                <InfoCard
                    icon={CreditCard}
                    title="Transaction Amount"
                    value={`ZMW ${order.total_amount?.toFixed(2) || '0.00'}`}
                    subValue={order.partialAmountTotal > 0 ?
                        `Partial: ZMW ${order.partialAmountTotal.toFixed(2)}` : undefined
                    }
                />
                <InfoCard
                    icon={Mail}
                    title="Email"
                    value={order.customers?.email || 'N/A'}
                />
                <InfoCard
                    icon={MapPin}
                    title="Delivery Address"
                    value={order.delivery_location || 'N/A'}
                />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionButton
                    icon={Eye}
                    label="View Specifications"
                    onClick={() => setCurrentPage('specifications')}
                />
                <ActionButton
                    icon={Package}
                    label={`View Products (${order.products?.length || 0})`}
                    onClick={() => setCurrentPage('products')}
                />
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleClose}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Close
                </button>

                {order.order_status === 'completed' || order.order_status === 'complete' ? (
                    <button
                        disabled
                        className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 opacity-50 cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Completed
                    </button>
                ) : order.order_payment_status === 'completed' || order.order_payment_status === 'paid' ? (
                    <button
                        disabled={loading}
                        onClick={() => onMarkSettled(order.id)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {loading ? 'Processing...' : 'Mark Settled'}
                    </button>
                ) : (
                    <button
                        disabled={paymentCheckLoading}
                        onClick={() => onCheckPaymentStatus(order.transaction_id, order.orderToken)}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {paymentCheckLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-4 h-4" />
                                Check Payment Status
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    const SpecificationsPage = () => (
        <div className="p-6 space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Customer Specifications
                    </h3>
                </div>
                <div className="p-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                            {order.sammarized_notes || "No specifications provided by the customer."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-start">
                <button
                    onClick={() => setCurrentPage('main')}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Back to Main Details
                </button>
            </div>
        </div>
    );

    const ProductsPage = () => (
        <div className="p-6 space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order Products ({order.products?.length || 0})
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    {order.products && order.products.length > 0 ? (
                        order.products.map((product, index) => (
                            <ProductAccordion
                                key={`${product.product_id}-${index}`}
                                productItem={product}
                                orderId={order.id}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No products found for this order.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-start">
                <button
                    onClick={() => setCurrentPage('main')}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Back to Main Details
                </button>
            </div>
        </div>
    );

    const ActionButton = ({ icon: Icon, label, onClick }: { icon: React.ComponentType<any>; label: string; onClick: () => void }) => (
        <button
            onClick={onClick}
            className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-center font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-90 zoom-in-90">
                <Header />
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {renderCurrentPage()}
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};