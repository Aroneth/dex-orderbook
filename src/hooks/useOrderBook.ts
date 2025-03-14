import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth, OrderUnit } from "../types";
import { diffUpdateOrders } from "../utils/orderBook";

const useOrderBook = (productId?: string) => {
  const [asks, setAsks] = useState<OrderUnit[]>([]);
  const [bids, setBids] = useState<OrderUnit[]>([]);

  // Wait, Socket seems doesn't need a loading state, does it?
  // const [isLoading, setIsLoading] = useState(true);

  const isInitialUpdateRef = useRef(false);

  const { socket, connected } = useSocket();
  
  // inner function to keep the callback reference consistent
  const handleOrderBook = useCallback(async (message: string) => {
    try {
      const data: BookDepth = JSON.parse(message);
      console.log(`[BookDepth] Received ${productId}: ${data.productId}, ${data.timestamp}, ${data.previousTimestamp}`)

      // Only update the data if it's the same productId as the event callback may be triggered by other components' subscriptions
      if (data.productId !== productId) return;

      // Only update the whole data-set if it's the initial update
      if (isInitialUpdateRef.current) {
        setAsks(data.asks);
        setBids(data.bids);
        isInitialUpdateRef.current = false;
      } else {
        // update the diff data-set
        setAsks((prevAsks) => {
          return diffUpdateOrders(prevAsks, data.asks);
        });
        setBids((prevBids) => {
          return diffUpdateOrders(prevBids, data.bids);
        });
      }
    } catch (error) {
      console.error(`[BookDepth] Error: ${error}`);
    }
  }, [productId]);

  useEffect(() => {
    if (!socket || !connected || !productId) return;

    // Each productId should have its own subscription
    // However if multiple subscribtions were made for the same productId, the server will only keep the latest one
    const bookDepthSubscriptionMessage = {
      type: "BookDepth",
      productId,
    };
    socket.emit("subscribe", bookDepthSubscriptionMessage);
    console.log(`Subscribed BookDepth: ${productId}`);

    isInitialUpdateRef.current = true;

    socket.on("BookDepth", handleOrderBook);
    console.log(`Subscribed BookDepth: ${productId}`);

    return () => {
      socket.off("BookDepth", handleOrderBook);
      console.log(`Unsubscribed BookDepth: ${productId}`);
    };
  }, [connected, socket, productId, handleOrderBook]);

  return {
    asks,
    bids,
  };
}

export default useOrderBook;
