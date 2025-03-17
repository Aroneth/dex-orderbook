import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { BookDepth } from '../types';

type OrderCallback = (data: BookDepth) => void;

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  subscribleBookDepth: (productId: string, subscriptionCallback: OrderCallback) => void;
  unsubscribeBookDepth: (productId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  subscribleBookDepth: () => {},
  unsubscribeBookDepth: () => {},
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

  // Callbacks map to keep track of the subscription callbacks for each productId
  const bookDepthCallbacksMap = useRef(new Map<string, Map<OrderCallback, string>>());

  /**
   * Handle OrderBook event
   */
  const handleOrderBook = useCallback((message: string) => {
    // console.log(`[BookDepth] Received ${message}`);
    try {
      const data = JSON.parse(message);
      const { productId } = data;
      const callbacks = bookDepthCallbacksMap.current.get(productId);
      if (callbacks) {
        callbacks.forEach((_, callback) => callback(data));
      }
    } catch (error) {
      console.error(`[BookDepth] Error: ${error}`);
    }
  }, []);

  /**
   * Add BookDepth subscription event directly to the socket for a specific productId
   * @param productId
   * @param subscriptionCallback
   */
  const subscribleBookDepth = useCallback((productId: string, subscriptionCallback: OrderCallback) => {
    if (!socket || !connected || !productId) return;

    // Each productId should have its own subscription
    // However if multiple subscribtions were made for the same productId, the server will only keep the latest one
    const bookDepthSubscriptionMessage = {
      type: "BookDepth",
      productId,
    };
    socket.emit("subscribe", bookDepthSubscriptionMessage);
    console.log(`Subscribed BookDepth: ${productId}`);

    const callbacks = bookDepthCallbacksMap.current.get(productId) || new Map<OrderCallback, string>();
    // Use the callback reference as the key to track thhe function accurately
    callbacks.set(subscriptionCallback, productId);
    bookDepthCallbacksMap.current.set(productId, callbacks);
  }, [connected, socket]);

  /**
   * Remove BookDepth subscription event for a specific productId
   * @param productId
   */
  const unsubscribeBookDepth = useCallback((productId: string) => {
    bookDepthCallbacksMap.current.delete(productId);
  }, []);

  /**
   * Initial socket events
   */
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
    socketInstance.on("BookDepth", handleOrderBook);
  }, [url, handleOrderBook]);

  /**
   * Initialize the socket connection
   */
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
      connected: socket?.connected || connected,
      subscribleBookDepth,
      unsubscribeBookDepth
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
