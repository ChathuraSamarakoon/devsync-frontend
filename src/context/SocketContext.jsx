/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // පරිශීලකයා ලොගින් වී ඇත්නම් පමණක් සම්බන්ධතාවය ඇති කරයි
    if (user && user._id) {
      socketRef.current = io();
      
      socketRef.current.on('connect', () => {
        console.log('Socket connection successful:', socketRef.current.id);
        socketRef.current.emit('setup_user', user._id);
        
        setSocket(socketRef.current);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setSocket(null);
        }
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};