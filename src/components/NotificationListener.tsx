import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

const NotificationListener = () => {
  const { onEvent, offEvent } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleNewNotification = (data: any) => {
      console.log('Received notification:', data);
      setNotifications((prev) => [...prev, data]);
    };

    // Listen for the `newNotification` event
    onEvent('newNotification', handleNewNotification);

    return () => {
      // Unsubscribe from the event when the component unmounts
      offEvent('newNotification');
    };
  }, [onEvent, offEvent]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li> // Assuming the payload has a `message` field
        ))}
      </ul>
    </div>
  );
};

export default NotificationListener;
