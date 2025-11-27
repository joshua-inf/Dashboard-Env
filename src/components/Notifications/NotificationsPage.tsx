"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    BellIcon,
    CheckCircleIcon,
    TrashIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    ArchiveBoxXMarkIcon,
    ClockIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import { NotificationDB } from "@/types/Notification";
import { NotificationService } from "@/services/apiNotification";
import { getOrgData } from "@/lib/createCookie";



const NotificationsPage = () => {
    const notificationService = new NotificationService()
    const business = getOrgData()
    const [notifications, setNotifications] = useState<NotificationDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' || notification.status === 'unread';
        const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
        return matchesFilter && matchesCategory;
    });

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? {
                ...notification,
                status: 'read',
                read_at: new Date().toISOString()
            } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({
            ...notification,
            status: 'read',
            read_at: new Date().toISOString()
        })));
    };

    const dismissNotification = (id: string) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? {
                ...notification,
                status: 'dismissed',
                dismissed_at: new Date().toISOString()
            } : notification
        ));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
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
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    const getNotifications = useCallback(async () => {
        try {
            setLoading(true)
            const getNotificationsFromDb = await notificationService.getNotificationsByBusinessId(business.id)
            if (getNotificationsFromDb) {
                setNotifications(getNotificationsFromDb)
            }
        } catch {
            console.log("error occured")
        } finally {
            setLoading(false)
        }
    }, [business.id])

    useEffect(() => {
        getNotifications()
    }, [getNotifications])


    if (loading) {
        return (
            <NotificationsSkeleton />
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage your business notifications
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <ArchiveBoxXMarkIcon className="h-4 w-4" />
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unreadCount}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Unread</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* Filter Tabs */}
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all'
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'unread'
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    Unread
                                </button>
                            </div>

                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="system">System</option>
                                <option value="order">Orders</option>
                                <option value="payment">Payments</option>
                                <option value="promotion">Promotions</option>
                                <option value="security">Security</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header Actions */}
                    {unreadCount > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={markAllAsRead}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                Mark all as read
                            </button>
                        </div>
                    )}

                    {/* Notifications */}
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <BellIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No notifications
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {filter === 'unread' ? "You're all caught up!" : "No notifications to display"}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${notification.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Type Icon */}
                                        <div className={`p-2 rounded-lg ${getTypeColor(notification.notification_type)}`}>
                                            {getTypeIcon(notification.notification_type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className={`font-semibold text-lg ${notification.status === 'unread'
                                                        ? 'text-gray-900 dark:text-white'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                        }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(notification.category)}`}>
                                                            {notification.category}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                                                            {notification.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                                {notification.status === 'unread' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                {notification.message}
                                            </p>

                                            {/* Tags */}
                                            {notification.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {notification.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <ClockIcon className="h-4 w-4" />
                                                        <span>{formatDate(notification.created_at)}</span>
                                                        <span>at</span>
                                                        <span>{formatTime(notification.created_at)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {notification.status === 'unread' ? (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            Mark read
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => dismissNotification(notification.id)}
                                                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                                        >
                                                            <EyeSlashIcon className="h-4 w-4" />
                                                            Dismiss
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/notifications/${notification.id}`}
                                                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                                    >
                                                        View details
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1 hidden text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


function NotificationsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 animate-pulse">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-7 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-72 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Stats + Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="h-6 w-10 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-2"></div>
                                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                            </div>

                            <div className="text-center">
                                <div className="h-6 w-10 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-2"></div>
                                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded mx-auto"></div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-2">
                                <div className="h-7 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                <div className="h-7 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>

                            <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Notifications List (skeleton items) */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>

                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        </div>

                                        <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>

                                    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NotificationsPage