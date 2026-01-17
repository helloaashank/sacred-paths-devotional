import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus, FiCheck, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRealtimeNotifications, RealtimeNotification } from '@/hooks/useRealtimeNotifications';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const NotificationIcon = ({ type }: { type: RealtimeNotification['type'] }) => {
  switch (type) {
    case 'like':
      return <FiHeart className="h-4 w-4 text-red-500" />;
    case 'comment':
      return <FiMessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <FiUserPlus className="h-4 w-4 text-green-500" />;
    default:
      return <FiBell className="h-4 w-4" />;
  }
};

const NotificationMessage = ({ notification }: { notification: RealtimeNotification }) => {
  const actorName = notification.actor?.display_name || notification.actor?.username || 'Someone';
  
  switch (notification.type) {
    case 'like':
      return <span><strong>{actorName}</strong> liked your post</span>;
    case 'comment':
      return <span><strong>{actorName}</strong> commented on your post</span>;
    case 'follow':
      return <span><strong>{actorName}</strong> started following you</span>;
    default:
      return <span>New notification</span>;
  }
};

interface NotificationItemProps {
  notification: RealtimeNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const linkTo = notification.type === 'follow' 
    ? `/profile/${notification.actor_id}`
    : notification.post_id 
      ? `/post/${notification.post_id}`
      : '#';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0',
        !notification.is_read && 'bg-primary/5'
      )}
    >
      <Link to={linkTo} className="flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.actor?.avatar_url || undefined} />
          <AvatarFallback>
            {notification.actor?.display_name?.[0] || notification.actor?.username?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link to={linkTo} className="block">
          <div className="flex items-center gap-2 mb-0.5">
            <NotificationIcon type={notification.type} />
            <p className="text-sm text-foreground line-clamp-2">
              <NotificationMessage notification={notification} />
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </Link>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {!notification.is_read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              onMarkAsRead(notification.id);
            }}
          >
            <FiCheck className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            onDelete(notification.id);
          }}
        >
          <FiTrash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const NotificationsDropdown = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useRealtimeNotifications();

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 relative">
          <FiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-[10px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <FiBell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
