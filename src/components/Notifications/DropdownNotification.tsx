'use client'
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { getOrgData } from "@/lib/createCookie";
import { NotificationService } from "@/services/apiNotification";
import ClickOutside from "../Layouts/ClickOutside";
import { useRouter } from "next/navigation";

interface NotificationDB {
  id: string;
  user_id: string;
  business_id: string;
  title: string;
  message: string;
  notification_type: "success" | "warning" | "info" | "error";
  priority: "low" | "normal" | "high";
  status: "read" | "unread" | "dismissed";
  category: "order" | "payment" | "security" | "system" | "promotion";
  action_url: string | null;
  action_label: string | null;
  metadata: Record<string, any>;
  tags: string[];
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  dismissed_at: string | null;
}

const DropdownNotification = () => {
  const notificationService = new NotificationService();
  const business = getOrgData();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDB[]>([]);
  const router = useRouter();

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleNotificationClick = async (notification: NotificationDB) => {
    try {
      // Mark as read if unread
      if (notification.status === 'unread') {
        await notificationService.markAsRead(notification.id);

        // Update local state
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n
        ));
      }

      // Navigate to the notification detail page
      router.push(`/notifications/${notification.id}`);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(business.id);

      // Update local state
      setNotifications(notifications.map(notification => ({
        ...notification,
        status: 'read',
        read_at: new Date().toISOString()
      })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotifications = useCallback(async () => {
    if (!business?.id) return;

    try {
      setLoading(true);
      const getNotificationsFromDb = await notificationService.getNotificationsByBusinessId(business.id);
      if (getNotificationsFromDb) {
        setNotifications(getNotificationsFromDb);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-105"
        >
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}

          <BellIcon className="h-5 w-5" />
        </button>

        {/* Dropdown Panel */}
        {dropdownOpen && (
          <div className="absolute -right-28 mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:right-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <li key={idx} className="p-4 flex gap-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700 mb-3">
                    <BellIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    We'll notify you when something arrives
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.slice(0, 6).map((notification) => (
                    <li key={notification.id}>
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${notification.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                      >
                        {/* Type Icon */}
                        {notification.notification_type && (
                          <div className="flex items-start gap-2">
                            <div className={`p-2 rounded-lg ${getTypeColor(notification.notification_type)} flex-shrink-0`}>
                              {getTypeIcon(notification.notification_type)}
                            </div>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-medium text-sm truncate ${notification.status === 'unread'
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {notification.title}
                              </p>
                              <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {notification.message}
                          </p>

                          {/* Tags */}
                          {notification.tags && notification.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {notification.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {notification.tags.length > 2 && (
                                <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                  +{notification.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(notification.created_at)}
                            </span>
                            {notification.status === 'unread' && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
                <Link
                  href="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  View all notifications ({notifications.length})
                </Link>
              </div>
            )}
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;