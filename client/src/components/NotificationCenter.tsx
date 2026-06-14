import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "goal" | "status" | "match_end";
  timestamp: Date;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate receiving notifications
    const interval = setInterval(() => {
      // This would be replaced with real WebSocket or polling logic
      // For now, we'll just check the match status periodically
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Show toast
    toast[notification.type === "goal" ? "success" : "info"](notification.title, {
      description: notification.message,
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        title="الإشعارات"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications List (hidden by default, would be shown in a dropdown) */}
      {notifications.length > 0 && (
        <div className="hidden md:block absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">الإشعارات</h3>
            <button
              onClick={clearNotifications}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              مسح الكل
            </button>
          </div>

          <div className="space-y-2">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className="p-3 bg-muted rounded-lg border-l-4 border-accent"
              >
                <p className="font-semibold text-sm text-foreground">
                  {notif.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {notif.timestamp.toLocaleTimeString("ar-SA")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
