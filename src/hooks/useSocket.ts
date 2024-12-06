import { useCallback, useEffect, useRef, useState } from 'react';
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
    let token = Cookies.get('accessToken');

    if (!token) {
      const newToken = await useRefreshToken();
      if(!newToken) return;
      token = Cookies.get('accessToken');
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      extraHeaders: {
        token: `${token}`,
      },
    });

    newSocket.on('connect', () => {
      setIsSocketConnected(true); // Set connection status to true
    });

    newSocket.on('connect_error', async (err) => {
      console.error('Socket connection error:', err.message);

      if (err.message === 'Invalid token') {
        // Refresh token and reconnect
        const newToken = await useRefreshToken();
        if (newToken) {
          newSocket.auth = { token: `Bearer ${newToken}` };
          newSocket.connect(); // Reconnect with new token
        }
      }
    });

    newSocket.on('disconnect', () => {
      setIsSocketConnected(false); // Set connection status to false
    });

    setSocket(newSocket);
  };

  // const onEvent = (event: string, callback: (data: any) => void) => {
  //   if (!socket || !isSocketConnected) {
  //     console.log(`Socket not ready for event: ${event}`);
  //     return;
  //   }
  
  //   // Avoid duplicate listeners
  //   if (eventHandlers.current[event]) {
  //     console.log(`Event ${event} is already bound.`);
  //     return;
  //   }
  
  //   console.log(`Listening to event: ${event}`);
  //   eventHandlers.current[event] = callback;
  //   socket.on(event, callback);
  // };

  // const offEvent = (event: string) => {
  //   if (!socket || !isSocketConnected) {
  //     return;
  //   }

  //   // Remove the event listener and clean up the stored handler
  //   const handler = eventHandlers.current[event];
  //   if (handler) {
  //     socket.off(event, handler);
  //     delete eventHandlers.current[event];
  //   }
  // };

  const onEvent = useCallback((event: string, callback: (data: any) => void) => {
    if (!socket || !isSocketConnected) return;
  
    if (eventHandlers.current[event]) return;
  
    eventHandlers.current[event] = callback;
    socket.on(event, callback);
  }, [socket, isSocketConnected]);
  
  const offEvent = useCallback((event: string) => {
    if (!socket || !isSocketConnected) return;
  
    const handler = eventHandlers.current[event];
    if (handler) {
      socket.off(event, handler);
      delete eventHandlers.current[event];
    }
  }, [socket, isSocketConnected]);
  

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
