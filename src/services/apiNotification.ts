import { supabase } from './SupabaseConfig';
import { Notification, NotificationDB } from "@/types/Notification";


export class NotificationService {
    async createNotification(newNotification: Omit<Notification, 'notification_id' | 'created_at'>): Promise<Notification | null> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([
                    {
                        user_id: newNotification.user_id,
                        message: newNotification.message,
                        status: newNotification.status || 'Unread',
                    },
                ])
                .single();

            if (error) {
                console.error("Error creating notification:", error.message);
                return null;
            }

            console.log("Notification created successfully:", data);
            return data;
        } catch (err) {
            console.error("Unexpected error creating notification:", err);
            return null;
        }
    }

    async getAllNotifications(): Promise<Notification[] | null> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*');

            if (error) {
                console.error("Error fetching notifications:", error.message);
                return null;
            }

            console.log("Notifications fetched successfully:", data);
            return data;
        } catch (err) {
            console.error("Unexpected error fetching notifications:", err);
            return null;
        }
    }

    async getNotificationsByBusinessId(businessId: string): Promise<NotificationDB[] | null> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq("business_id", businessId);

            if (error) {
                console.error("Error fetching notifications:", error.message);
                return null;
            }

            console.log("User notifications fetched successfully:", data);
            return data;
        } catch (err) {
            console.error("Unexpected error fetching notifications:", err);
            return null;
        }
    }

    async markAllAsRead(businessId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ status: 'Read' })
                .eq('business_id', businessId);

            if (error) {
                console.error("Error marking notifications as read:", error.message);
                return false;
            }

            console.log("All notifications marked as read successfully");
            return true;
        } catch (err) {
            console.error("Unexpected error marking notifications as read:", err);
            return false;
        }
    }

    async updateNotificationStatus(notificationId: number, status: 'Unread' | 'Read'): Promise<Notification | null> {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .update({ status })
                .eq('notification_id', notificationId)
                .single();

            if (error) {
                console.error("Error updating notification status:", error.message);
                return null;
            }

            console.log("Notification status updated successfully:", data);
            return data;
        } catch (err) {
            console.error("Unexpected error updating notification:", err);
            return null;
        }
    }

    async markAsRead(notificationid: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ status: 'Read' })
                .eq('notification_id', notificationid);

            if (error) {
                console.error("Error marking notification as read:", error.message);
                return false;
            }

            console.log("Notification marked as read successfully");
            return true;
        } catch (err) {
            console.error("Unexpected error marking notification as read:", err);
            return false;
        }
    }

    async deleteNotification(notificationId: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('notification_id', notificationId);

            if (error) {
                console.error("Error deleting notification:", error.message);
                return false;
            }

            console.log("Notification deleted successfully");
            return true;
        } catch (err) {
            console.error("Unexpected error deleting notification:", err);
            return false;
        }
    }

}

