import { useState } from "react";
import { getOrgData } from "@/lib/createCookie";
import { getOrderImages, getOrdersByBusinessId, marckSettled } from "@/services/api/apiOrder";
import { updatePaymentStatus } from "@/services/api/apiOrder";
import { OrderData } from "@/types/Orders";
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { OrderDetailsDialog } from "./OrderDetailsDialog ";

// Image Component
const OrderImage = ({ orderId }: { orderId: string }) => {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderImages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrderImages(orderId);
            setImages(response || []);
        } catch (err) {
            console.error("Error fetching order images:", err);
            setError("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        fetchOrderImages();
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-xs text-gray-500 dark:text-gray-400">No images</span>
            </div>
        );
    }

    return (
        <div className="flex gap-1">
            {images.slice(0, 2).map((img, index) => (
                <div key={index} className="relative w-10 h-10">
                    <Image
                        src={img}
                        alt={`Order image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                        sizes="40px"
                    />
                    {index === 1 && images.length > 2 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                            <span className="text-xs text-white">+{images.length - 2}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Info Block Component
const InfoBlock = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {value || "—"}
        </div>
    </div>
);

// Status Badge Component
const StatusBadge = ({ status, type }: { status: string; type: 'order' | 'payment' }) => {
    const getStatusConfig = () => {
        if (type === 'payment') {
            return {
                pending: {
                    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
                    text: 'text-yellow-800 dark:text-yellow-400',
                    icon: AlertTriangleIcon,
                    label: 'Not Paid'
                },
                paid: {
                    bg: 'bg-green-100 dark:bg-green-900/20',
                    text: 'text-green-800 dark:text-green-400',
                    icon: CheckCircleIcon,
                    label: 'Paid'
                }
            }[status] || {
                bg: 'bg-gray-100 dark:bg-gray-700',
                text: 'text-gray-800 dark:text-gray-300',
                icon: ClockIcon,
                label: status
            };
        }

        // Order status
        return {
            pending: {
                bg: 'bg-blue-100 dark:bg-blue-900/20',
                text: 'text-blue-800 dark:text-blue-400',
                icon: ClockIcon,
                label: 'Pending'
            },
            completed: {
                bg: 'bg-green-100 dark:bg-green-900/20',
                text: 'text-green-800 dark:text-green-400',
                icon: CheckCircleIcon,
                label: 'Completed'
            },
            complete: {
                bg: 'bg-green-100 dark:bg-green-900/20',
                text: 'text-green-800 dark:text-green-400',
                icon: CheckCircleIcon,
                label: 'Complete'
            }
        }[status] || {
            bg: 'bg-gray-100 dark:bg-gray-700',
            text: 'text-gray-800 dark:text-gray-300',
            icon: ClockIcon,
            label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-4 h-4" />
            {config.label}
        </span>
    );
};

interface TableRowProps {
    order: OrderData;
    setOrderData: (data: OrderData[]) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ order, setOrderData }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentCheckLoading, setPaymentCheckLoading] = useState(false);
    const businessData = getOrgData();

    const handleMarkSettled = async (orderId: string) => {
        try {
            setLoading(true);
            await marckSettled(orderId);

            // Refresh orders data
            const updatedOrders = await getOrdersByBusinessId(businessData?.id);
            setOrderData(updatedOrders);
        } catch (error) {
            console.error("Error marking order as settled:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePaymentStatus = async (paymentId: string, token: string) => {
        try {
            setPaymentCheckLoading(true);
            await updatePaymentStatus(paymentId, token);

            // Refresh orders data
            const updatedOrders = await getOrdersByBusinessId(businessData?.id);
            setOrderData(updatedOrders);
        } catch (error) {
            console.error("Error updating payment status:", error);
        } finally {
            setPaymentCheckLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZM', {
            style: 'currency',
            currency: 'ZMW',
        }).format(amount);
    };

    return (
        <>
            <OrderDetailsDialog
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                order={order}
                onMarkSettled={handleMarkSettled}
                onCheckPaymentStatus={handleUpdatePaymentStatus}
                loading={loading}
                paymentCheckLoading={paymentCheckLoading}
            />

            <tr
                onClick={() => setShowDetails(true)}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
                {/* Order Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.order_status} type="order" />
                </td>

                {/* Order Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(order.created_at)}
                </td>

                {/* Customer Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customers?.name || 'N/A'}
                    </div>
                    {order.customers?.email && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customers.email}
                        </div>
                    )}
                </td>

                {/* Order ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {order.order_id}
                    </code>
                </td>

                {/* Order Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(order.total_amount)}
                </td>

                {/* Payment Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                        status={order.order_payment_status}
                        type="payment"
                    />
                </td>
            </tr>
        </>
    );
};