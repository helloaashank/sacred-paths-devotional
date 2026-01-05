import { LocalNotifications, ScheduleOptions, PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationSchedule {
  id: number;
  title: string;
  body: string;
  scheduleAt: Date;
  repeat?: 'daily' | 'weekly';
}

export const useNotifications = () => {
  const isNative = Capacitor.isNativePlatform();

  const requestPermissions = async (): Promise<boolean> => {
    if (!isNative) {
      console.log('Notifications only work on native platforms');
      return false;
    }

    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  };

  const checkPermissions = async (): Promise<boolean> => {
    if (!isNative) return false;
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  };

  const scheduleNotification = async (notification: NotificationSchedule): Promise<boolean> => {
    if (!isNative) {
      console.log('Notifications only work on native platforms');
      return false;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.error('Notification permission denied');
      return false;
    }

    const scheduleOptions: ScheduleOptions = {
      notifications: [
        {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          schedule: {
            at: notification.scheduleAt,
            allowWhileIdle: true, // Works when device is in Doze mode
            ...(notification.repeat === 'daily' && { every: 'day' }),
            ...(notification.repeat === 'weekly' && { every: 'week' }),
          },
          sound: 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          largeIcon: 'splash',
        },
      ],
    };

    try {
      await LocalNotifications.schedule(scheduleOptions);
      console.log('Notification scheduled:', notification);
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  };

  const cancelNotification = async (id: number): Promise<void> => {
    if (!isNative) return;

    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      console.log('Notification cancelled:', id);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  };

  const cancelAllNotifications = async (): Promise<void> => {
    if (!isNative) return;

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  };

  const getPendingNotifications = async (): Promise<PendingLocalNotificationSchema[]> => {
    if (!isNative) return [];

    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      return [];
    }
  };

  const addNotificationListeners = async () => {
    if (!isNative) return;

    // When notification is received while app is open
    await LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });

    // When user taps on notification
    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      console.log('Notification action performed:', action);
    });
  };

  const removeAllListeners = async () => {
    if (!isNative) return;
    await LocalNotifications.removeAllListeners();
  };

  return {
    isNative,
    requestPermissions,
    checkPermissions,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getPendingNotifications,
    addNotificationListeners,
    removeAllListeners,
  };
};
