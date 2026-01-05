import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications, NotificationSchedule } from '@/hooks/useNotifications';
import { Bell, BellOff, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationScheduler = () => {
  const { toast } = useToast();
  const { isNative, requestPermissions, scheduleNotification, cancelAllNotifications, getPendingNotifications } = useNotifications();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>('none');
  const [pendingCount, setPendingCount] = useState(0);

  const handleRequestPermission = async () => {
    const granted = await requestPermissions();
    toast({
      title: granted ? 'Permission Granted' : 'Permission Denied',
      description: granted 
        ? 'You will receive notifications' 
        : 'Please enable notifications in settings',
    });
  };

  const handleSchedule = async () => {
    if (!title || !body || !scheduleDate || !scheduleTime) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    const scheduleAt = new Date(`${scheduleDate}T${scheduleTime}`);
    
    if (scheduleAt <= new Date()) {
      toast({
        title: 'Invalid Time',
        description: 'Please select a future date/time',
        variant: 'destructive',
      });
      return;
    }

    const notification: NotificationSchedule = {
      id: Date.now(),
      title,
      body,
      scheduleAt,
      ...(repeat !== 'none' && { repeat }),
    };

    const success = await scheduleNotification(notification);
    
    if (success) {
      toast({
        title: 'Notification Scheduled',
        description: `Will notify at ${scheduleAt.toLocaleString()}`,
      });
      setTitle('');
      setBody('');
      setScheduleDate('');
      setScheduleTime('');
      setRepeat('none');
      refreshPendingCount();
    } else {
      toast({
        title: 'Failed',
        description: 'Could not schedule notification',
        variant: 'destructive',
      });
    }
  };

  const handleCancelAll = async () => {
    await cancelAllNotifications();
    setPendingCount(0);
    toast({
      title: 'Cancelled',
      description: 'All notifications cancelled',
    });
  };

  const refreshPendingCount = async () => {
    const pending = await getPendingNotifications();
    setPendingCount(pending.length);
  };

  if (!isNative) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Notifications only work on Android device via Capacitor
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Schedule Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleRequestPermission} variant="outline" className="w-full">
          Request Permission
        </Button>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Message</Label>
          <Input
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Notification message"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Repeat</Label>
          <Select value={repeat} onValueChange={(v) => setRepeat(v as 'none' | 'daily' | 'weekly')}>
            <SelectTrigger>
              <SelectValue placeholder="Select repeat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Repeat</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSchedule} className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Notification
        </Button>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            Pending: {pendingCount} notifications
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={refreshPendingCount}>
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancelAll}>
              <BellOff className="mr-2 h-4 w-4" />
              Cancel All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
