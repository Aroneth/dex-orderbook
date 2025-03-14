import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth, OrderUnit } from "../types";
import { diffUpdateOrders } from "../utils/orderBook";

const useOrderBook = (productId?: string) => {
  const [asks, setAsks] = useState<OrderUnit[]>([]);
  const [bids, setBids] = useState<OrderUnit[]>([]);

  // Wait, Socket seems doesn't need a loading state, does it?
  const [isLoading, setIsLoading] = useState(true);

  const isInitialUpdateRef = useRef(false);

  const { subscribleBookDepth, unsubscribeBookDepth } = useSocket();
  
  // inner function to keep the callback reference consistent
  const handleOrderBook = useCallback(async (data: BookDepth) => {
    console.log(`[BookDepth] Received ${productId}: ${data.productId}, ${data.timestamp}, ${data.previousTimestamp}`)

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
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    isInitialUpdateRef.current = true;

    subscribleBookDepth(productId, handleOrderBook);
    console.log(`Subscribed BookDepth: ${productId}`);

    return () => {
      unsubscribeBookDepth("BookDepth");
      console.log(`Unsubscribed BookDepth: ${productId}`);
    };
  }, [productId, handleOrderBook, subscribleBookDepth, unsubscribeBookDepth]);

  return {
    isLoading,
    asks,
    bids,
  };
}

export default useOrderBook;
