import { useNotification } from '@/contexts/NotificationContext';
import { Toast } from '@/components/ui/toast';

export function ToastContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Toast
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}
