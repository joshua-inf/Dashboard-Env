"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    TrashIcon,
    ClockIcon,
    TagIcon,
    EyeIcon,
    EyeSlashIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import { NotificationDB } from "@/types/Notification";
import { getOrgData } from "@/lib/createCookie";
import { NotificationService } from "@/services/apiNotification";


const NotificationDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const notificationId = params.id as string;
    const [notification, setNotification] = useState<NotificationDB | null>(null);
    const [loading, setLoading] = useState(true);
    const notificationService = new NotificationService()

    // Mock data - replace with actual API call
    const notificationsData: NotificationDB[] = [
        {
            id: "1",
            user_id: "user-123",
            business_id: "business-001",
            title: "Order Completed Successfully",
            message: "Your order #ORD-7842 has been delivered and completed. Thank you for your business!",
            notification_type: "success",
            priority: "normal",
            status: "unread",
            category: "order",
            action_url: null,
            action_label: null,
            metadata: { order_id: "ORD-7842" },
            tags: ["order", "delivery"],
            expires_at: null,
            created_at: "2025-05-12T14:30:00Z",
            updated_at: "2025-05-12T14:30:00Z",
            read_at: null,
            dismissed_at: null
        },
        {
            id: "2",
            user_id: "user-123",
            business_id: "business-001",
            title: "Payment Received",
            message: "A payment of $245.00 has been successfully processed for invoice #INV-4582.",
            notification_type: "success",
            priority: "normal",
            status: "unread",
            category: "payment",
            action_url: null,
            action_label: null,
            metadata: { invoice_id: "INV-4582", amount: 245.0 },
            tags: ["payment"],
            expires_at: null,
            created_at: "2025-05-11T09:15:00Z",
            updated_at: "2025-05-11T09:15:00Z",
            read_at: null,
            dismissed_at: null
        },
        // ... include all other notifications
    ];

    const getNotification = useCallback(async () => {
        try {
            setLoading(true)
            const notification = await notificationService.getNotificationById(notificationId)
            if (notification) {
                setNotification(notification)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getNotification()
    }, [getNotification]);

    const markAsRead = async () => {
        if (!notificationId) return;
        await notificationService.markAsRead(notificationId);

        if (notification?.status === 'unread') {
            setNotification({
                ...notification,
                status: 'read',
                read_at: new Date().toISOString()
            });
        }
    };

    const dismissNotification = async () => {
        if (!notificationId) return;
        await notificationService.dismissNotification(notificationId);
        if (notification?.status === 'unread') {
            setNotification({
                ...notification,
                status: 'dismissed',
                dismissed_at: new Date().toISOString()
            });
        }
    };

    const deleteNotification = () => {
        // API call to delete notification
        router.push('/notifications');
    };

    const getTypeIcon = (type: NotificationDB['notification_type']) => {
        const icons: Record<string, any> = {
            success: CheckCircleIcon,
            warning: ExclamationTriangleIcon,
            error: ExclamationTriangleIcon,
            info: InformationCircleIcon
        };
        const Icon = icons[type] ?? InformationCircleIcon; // fallback
        return <Icon className="h-4 w-4" />;
    };

    const getTypeColor = (type: NotificationDB['notification_type']) => {
        const colors: Record<string, string> = {
            success: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
            warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
            error: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
            info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
        };
        return colors[type] ?? 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    };

    const getPriorityColor = (priority: NotificationDB['priority']) => {
        const colors = {
            low: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400',
            normal: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
            high: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
        };
        return colors[priority];
    };


    const getCategoryColor = (category: NotificationDB['category']) => {
        const colors = {
            system: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
            order: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            payment: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            promotion: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            security: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        };
        return colors[category];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notification...</p>
                </div>
            </div>
        );
    }

    if (!notification) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Notification not found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The notification you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/notifications"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Notifications
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href="/notifications"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to notifications
                        </Link>
                    </div>

                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notification Details</h1>
                        <div className="flex items-center gap-2">
                            {notification.status === 'unread' && (
                                <button
                                    onClick={markAsRead}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                    Mark as read
                                </button>
                            )}
                            {notification.status !== 'dismissed' && (
                                <button
                                    onClick={dismissNotification}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                >
                                    <EyeSlashIcon className="h-4 w-4" />
                                    Dismiss
                                </button>
                            )}
                            <button
                                onClick={deleteNotification}
                                className="flex hidden items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${getTypeColor(notification.notification_type)}`}>
                                {getTypeIcon(notification.notification_type)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {notification.title}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(notification.category)}`}>
                                            {notification.category}
                                        </span>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                                            {notification.priority} priority
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>Created: {formatDate(notification.created_at)}</span>
                                    </div>

                                    {notification.status === 'unread' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            Unread
                                        </span>
                                    )}
                                    {notification.status === 'dismissed' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            Dismissed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="p-6">
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                {notification.message}
                            </p>
                        </div>

                        {/* Tags */}
                        {notification.tags.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {notification.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                        >
                                            <TagIcon className="h-3 w-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {notification.action_url && notification.action_label && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <DocumentTextIcon className="h-4 w-4" />
                                    This notification requires your attention
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Meta Information */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Notification Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Notification ID:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-mono">{notification.id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Business ID:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-mono">{notification.business_id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Type:</span>
                            <span className="ml-2 text-gray-900 dark:text-white capitalize">{notification.notification_type}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Priority:</span>
                            <span className="ml-2 text-gray-900 dark:text-white capitalize">{notification.priority}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Status:</span>
                            <span className={`ml-2 capitalize ${notification.status === 'unread'
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : notification.status === 'dismissed'
                                    ? 'text-gray-600 dark:text-gray-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}>
                                {notification.status}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Created:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{formatDate(notification.created_at)}</span>
                        </div>
                        {notification.read_at && (
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Read:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{formatDate(notification.read_at)}</span>
                            </div>
                        )}
                        {notification.dismissed_at && (
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Dismissed:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{formatDate(notification.dismissed_at)}</span>
                            </div>
                        )}
                        {notification.expires_at && (
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Expires:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{formatDate(notification.expires_at)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailPage;