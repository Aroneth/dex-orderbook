import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

interface SocketProviderProps extends PropsWithChildren {
  url: string;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const initialSocketEvents = useCallback((socketInstance: Socket) => {
    socketInstance.on("connecting", () => console.log("Attempting connection..."));
    socketInstance.on("disconnect", () => {
      console.log("Disconnected")
      setConnected(false);
    });
    socketInstance.on("error", (err) => console.log("Error encountered", err));
    socketInstance.on("exception", (err) => console.log("Caught exception", err));
    socketInstance.on("reconnect_attempt", () => console.log("Attempting to reconnect..."));

    socketInstance.on("connect", async () => {
      console.log(`Connected to ${url}`);
      setConnected(true);
    });
  }, [url])

  useEffect(() => {
    const socketInstance = io(url, { transports: ["websocket"], autoConnect: false });
    setSocket(socketInstance);
    console.log(`Connecting to ws gateway ${url}`);

    initialSocketEvents(socketInstance);

    socketInstance.connect();

    return () => {
      socketInstance.disconnect();
    };
  }, [url, initialSocketEvents]);

  return (
    <SocketContext.Provider value={{
      socket,
      connected: socket?.connected || connected
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
