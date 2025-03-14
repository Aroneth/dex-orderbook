import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps extends PropsWithChildren {
  url: string;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }) => {
  const [productId, setProductId] = useState<string>();
  const [socket, setSocket] = useState<Socket | null>(null);

  const initialSocketEvents = useCallback((socketInstance: Socket) => {
    socketInstance.on("connecting", () => console.log("Attempting connection..."));
    socketInstance.on("disconnect", () => console.log("Disconnected"));
    socketInstance.on("error", (err) => console.log("Error encountered", err));
    socketInstance.on("exception", (err) => console.log("Caught exception", err));
    socketInstance.on("reconnect_attempt", () => console.log("Attempting to reconnect..."));
  }, [])

  useEffect(() => {
    if (productId) return;

    fetch('https://api.etherealtest.net/v1/product').then((response) => {
      return response.json();
    }).then((res) => {
      const { data } = res;
      console.log('product', data[0].id);
      setProductId(data[0].id);
    }).catch((err) => {
      console.log('error', err);
    });
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    const socketInstance = io(url, { transports: ["websocket"], autoConnect: false });
    setSocket(socketInstance);
    console.log(`Connecting to ws gateway ${URL}`);

    socketInstance.on("connect", async () => {
      console.log(`Connected to ${URL}`);
  
      const bookDepthSubscriptionMessage = {
        type: "BookDepth",
        productId: productId,
      };
      socketInstance.emit("subscribe", bookDepthSubscriptionMessage);
      console.log(`Subscribed BookDepth: ${productId}`);
    });

    initialSocketEvents(socketInstance);

    // Explicitly connect to ws stream _after_ binding message callbacks.
    socketInstance.connect();

    return () => {
      socketInstance.disconnect();
    };
  }, [url, productId, initialSocketEvents]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
