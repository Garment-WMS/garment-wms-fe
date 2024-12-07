import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { ScrollArea } from './ui/ScrollArea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { Button } from './ui/button';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Colors from '@/constants/color';
import privateCall from '@/api/PrivateCaller';
import { notificationApi } from '@/api/services/notification';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
const NotificationListener = () => {
  const { onEvent, offEvent } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const iconSize = 32;
  const blue = Colors.blue[500];
  const navigate = useNavigate();
  const [isReadCount, setIsReadCount] = useState(0);
  useEffect(() => {
    const handleNewNotification = (data: any) => {
      setNotifications((prev) => [data, ...prev]);
      setIsReadCount(countUnread([data, ...notifications]));
    };

    // Listen for the `newNotification` event
    onEvent('newNotification', handleNewNotification);

    return () => {
      // Unsubscribe from the event when the component unmounts
      offEvent('newNotification');
    };
  }, [onEvent, offEvent]);
  const markAsRead = async (id: string) => {
    try {
      await privateCall(notificationApi.getOneAndMarkSeen(id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleClick = (id: string, path: string) => {
    markAsRead(id);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true } // Update `isRead` to true
          : notification
      )
    );
    setIsReadCount((prev) => prev - 1);
    navigate(`${path}`);
  };
  function countUnread(notifications: any[]) {
    return notifications.filter((notification) => !notification.isRead).length;
  }
  const fetchNotifications = async () => {
    try {
      const res = await privateCall(notificationApi.getAll());
      if (res.status === 200) {
        const notifications = res.data.data;
        // const unreadCount = notifications.filter((notification: any) => !notification.isRead).length;
        setIsReadCount(countUnread(notifications)); // Update the unread count
        notifications.sort(
          (a: any, b: any) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
        );
        setNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  // const [expandedNotifications, setExpandedNotifications] = useState<string[]>([]);

  // const toggleExpand = (id: string) => {
  //   setExpandedNotifications((prev) =>
  //     prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
  //   );
  // };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="relative rounded-full">
            <IoIosNotificationsOutline color={blue} size={iconSize} />
            {isReadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {isReadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[360px]" align="end" forceMount>
          {/* <NotificationList 
        notifications={notifications}
      /> */}
          <div className="w-full">
            {/* <div className="flex justify-between items-center mb-2 px-2">
  <h3 className="font-semibold text-sm">Notifications</h3>
  <Button variant="ghost" size="sm" onClick={onClearAll}>Clear all</Button>
</div> */}
            <ScrollArea className="h-[300px] w-auto">
              {notifications?.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="mb-2 p-2 bg-gray-100 rounded-md w-fit">
                    <div className="">
                      <div className=" w-fit ">
                        <h4 className="font-medium text-sm flex gap-2 items-center">
                          {notification.title}{' '}
                          {notification?.isRead === false && (
                            <div className={` rounded-full bg-bluePrimary w-3 h-3`} />
                          )}
                        </h4>
                        <p
                          // className={`text-xs w-76 ${expandedNotifications.includes(notification.id) ? '' : 'truncate'}`}
                          className="text-xs w-76">
                          {notification.message}
                        </p>
                        {/* {notification.message?.length > 50 && (
                        <button
                          onClick={() => toggleExpand(notification.id)}
                          className="text-xs text-blue-500 mt-1">
                          {expandedNotifications.includes(notification.id)
                            ? 'Show less'
                            : 'Show more'}
                        </button>
                      )} */}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Use 24-hour format
                      })}
                    </p>

                    <Button
                      className="ml-4"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleClick(notification.id, notification.path)}>
                      See details
                    </Button>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationListener;
