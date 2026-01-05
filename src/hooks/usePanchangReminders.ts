import { useNotifications, NotificationSchedule } from './useNotifications';
import panchangData from '@/data/panchang.json';
import { parse, isFuture, setHours, setMinutes } from 'date-fns';

interface PanchangReminder {
  date: string;
  city: string;
  festivals: string[];
  tithi: string;
}

const REMINDER_STORAGE_KEY = 'panchang_reminders_enabled';
const REMINDER_CITY_KEY = 'panchang_reminder_city';

export const usePanchangReminders = () => {
  const { 
    isNative, 
    scheduleNotification, 
    cancelNotification, 
    requestPermissions,
    getPendingNotifications 
  } = useNotifications();

  const getRemindersEnabled = (): boolean => {
    return localStorage.getItem(REMINDER_STORAGE_KEY) === 'true';
  };

  const getReminderCity = (): string => {
    return localStorage.getItem(REMINDER_CITY_KEY) || 'delhi';
  };

  const setRemindersEnabled = (enabled: boolean) => {
    localStorage.setItem(REMINDER_STORAGE_KEY, enabled.toString());
  };

  const setReminderCity = (city: string) => {
    localStorage.setItem(REMINDER_CITY_KEY, city);
  };

  // Get upcoming festivals and special tithis from panchang data
  const getUpcomingReminders = (city: string): PanchangReminder[] => {
    const reminders: PanchangReminder[] = [];
    const today = new Date();

    Object.entries(panchangData.data).forEach(([dateStr, cityData]) => {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      
      if (isFuture(date) && cityData[city]) {
        const data = cityData[city];
        const hasFestival = data.festivals && data.festivals.length > 0;
        const isSpecialTithi = ['Purnima', 'Amavasya', 'Ekadashi'].some(
          t => data.tithi?.includes(t)
        );

        if (hasFestival || isSpecialTithi) {
          reminders.push({
            date: dateStr,
            city,
            festivals: data.festivals || [],
            tithi: data.tithi
          });
        }
      }
    });

    return reminders.sort((a, b) => a.date.localeCompare(b.date));
  };

  // Generate notification ID from date string
  const getNotificationId = (dateStr: string): number => {
    return parseInt(dateStr.replace(/-/g, ''), 10);
  };

  // Schedule all upcoming festival/tithi reminders
  const scheduleAllReminders = async (city: string): Promise<number> => {
    if (!isNative) {
      console.log('Reminders only work on native platforms');
      return 0;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return 0;
    }

    const reminders = getUpcomingReminders(city);
    let scheduled = 0;

    for (const reminder of reminders) {
      const date = parse(reminder.date, 'yyyy-MM-dd', new Date());
      // Schedule notification for 6:00 AM on the day
      const notificationTime = setMinutes(setHours(date, 6), 0);

      if (!isFuture(notificationTime)) continue;

      let title = '🪔 Panchang Reminder';
      let body = '';

      if (reminder.festivals.length > 0) {
        title = `🎉 ${reminder.festivals[0]}`;
        body = `Today is ${reminder.festivals.join(', ')}. ${reminder.tithi} tithi.`;
      } else {
        title = `🌙 ${reminder.tithi}`;
        body = `Today is ${reminder.tithi}. An auspicious day for prayers and rituals.`;
      }

      const notification: NotificationSchedule = {
        id: getNotificationId(reminder.date),
        title,
        body,
        scheduleAt: notificationTime,
      };

      const success = await scheduleNotification(notification);
      if (success) scheduled++;
    }

    setRemindersEnabled(true);
    setReminderCity(city);
    return scheduled;
  };

  // Cancel all panchang reminders
  const cancelAllReminders = async (): Promise<void> => {
    if (!isNative) return;

    const pending = await getPendingNotifications();
    const reminders = getUpcomingReminders(getReminderCity());

    for (const reminder of reminders) {
      const id = getNotificationId(reminder.date);
      if (pending.some(n => n.id === id)) {
        await cancelNotification(id);
      }
    }

    setRemindersEnabled(false);
  };

  // Get count of scheduled reminders
  const getScheduledCount = async (): Promise<number> => {
    if (!isNative) return 0;
    
    const pending = await getPendingNotifications();
    const reminders = getUpcomingReminders(getReminderCity());
    const reminderIds = new Set(reminders.map(r => getNotificationId(r.date)));
    
    return pending.filter(n => reminderIds.has(n.id)).length;
  };

  return {
    isNative,
    getRemindersEnabled,
    getReminderCity,
    getUpcomingReminders,
    scheduleAllReminders,
    cancelAllReminders,
    getScheduledCount,
  };
};
