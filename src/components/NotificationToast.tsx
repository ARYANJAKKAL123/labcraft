import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/hooks/useNotification';

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export function NotificationToast({ notifications, onRemove }: NotificationToastProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[300px] max-w-[400px] animate-fade-in ${styles[notification.type]}`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${iconColors[notification.type]}`} />
            <div className="flex-1 text-sm">{notification.message}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 -mt-1 -mr-2"
              onClick={() => onRemove(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
