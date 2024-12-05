import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useRefreshToken } from '@/hooks/useRefreshToken';

const SOCKET_SERVER_URL = 'https://garment-wms-be-1.onrender.com/notification';

interface UseSocket {
  onEvent: (event: string, callback: (data: any) => void) => void;
  offEvent: (event: string) => void;
  socket: Socket | null;
  isSocketConnected: boolean; // New state to track the connection status
}

export const useSocket = (): UseSocket => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false); // Track connection state
  const eventHandlers = useRef<Record<string, (data: any) => void>>({});

  const connectSocket = async () => {
    const token = Cookies.get('accessToken');

    if (!token) {
      console.error('Access token is missing');
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${token}`,
      },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsSocketConnected(true); // Set connection status to true
    });

    newSocket.on('connect_error', async (err) => {
      console.error('Socket connection error:', err.message);

      if (err.message === 'Invalid token') {
        // Refresh token and reconnect
        const newToken = await useRefreshToken();
        if (newToken) {
          newSocket.auth.token = `Bearer ${newToken}`;
          newSocket.connect(); // Reconnect with new token
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsSocketConnected(false); // Set connection status to false
    });

    setSocket(newSocket);
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    if (!socket || !isSocketConnected) {
      console.log('Socket is not connected');
      return;
    }

    // Store the event handler for cleanup later
    eventHandlers.current[event] = callback;
    socket.on(event, callback);
  };

  const offEvent = (event: string) => {
    if (!socket || !isSocketConnected) {
      console.log('Socket is not connected');
      return;
    }

    // Remove the event listener and clean up the stored handler
    const handler = eventHandlers.current[event];
    if (handler) {
      socket.off(event, handler);
      delete eventHandlers.current[event];
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return { onEvent, offEvent, socket, isSocketConnected };
};
