import { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth, OrderUnit } from "../types";
import { diffUpdateOrders } from "../utils/orderBook";

const useOrderBook = (productId?: string) => {
  const [asks, setAsks] = useState<OrderUnit[]>([]);
  const [bids, setBids] = useState<OrderUnit[]>([]);
  // Wait, Socket seems doesn't need a loading state
  // const [isLoading, setIsLoading] = useState(true);

  const isInitialUpdateRef = useRef(false);

  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !productId) return;
    const bookDepthSubscriptionMessage = {
      type: "BookDepth",
      productId,
    };
    socket.emit("subscribe", bookDepthSubscriptionMessage);
    console.log(`Subscribed BookDepth: ${productId}`);

    isInitialUpdateRef.current = true;
  }, [socket, connected, productId]);

  useEffect(() => {
    if (!socket || !connected) return;

    // inner function to keep the callback reference consistent
    const handleOrderBook = async (message: string) => {
      console.log(`[BookDepth] Received ${message}`)
      try {
        const data: BookDepth = JSON.parse(message);
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
    };

    socket.on("BookDepth", handleOrderBook);
    console.log(`Subscribed BookDepth: ${productId}`);

    return () => {
      console.log(`Unsubscribed BookDepth: ${productId}`);
      socket.off("BookDepth", handleOrderBook);
    };
  }, [connected, socket, productId]);

  return {
    asks,
    bids,
  };
}

export default useOrderBook;
