import { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth, OrderUnit } from "../types";
import { useQuery } from "@tanstack/react-query";
import { diffUpdateOrders } from "../utils/orderBook";

const useOrderBookQuery = (productId?: string) => {
  const { socket, connected } = useSocket();

  const [asks, setAsks] = useState<OrderUnit[]>([]);
  const [bids, setBids] = useState<OrderUnit[]>([]);

  const isInitialUpdateRef = useRef(false);

  const query = useQuery({
    queryKey: ['orderbook', productId],
    queryFn: async () => {
      if (!socket || !connected || !productId) return;

      const bookDepthSubscriptionMessage = {
        type: "BookDepth",
        productId,
      };
      socket.emit("subscribe", bookDepthSubscriptionMessage);
      console.log(`Subscribed BookDepth in Query: ${productId}`);
      isInitialUpdateRef.current = true;

      // The Promise in React-Query will only be resolved once for the first event callback
      const subscribePromise = new Promise((resolve, reject) => {
        socket.on("BookDepth", async (message: string) => {
          // console.log(`[BookDepth] Received in Query ${message}`)
          try {
            const data: BookDepth = JSON.parse(message);
            if (data.productId !== productId) return;

            // Move diffUpdateOrders to the upper component which is using this Hook
            resolve({
              asks: data.asks,
              bids: data.bids,
            })
          } catch (error) {
            console.error(`[BookDepth] Error in Query: ${error}`);
            reject(error);
          }
        });
        console.log(`Subscribed BookDepth in Query: ${productId}`);
      })
      
      return subscribePromise
    },
    enabled: connected && !!socket,
  })

  useEffect(() => {
    if (!query.data) return;

    const { asks, bids } = query.data as any;
    console.log(`[BookDepth] Received in Query ${asks}, ${bids}`)

    // Only update the whole data-set if it's the initial update
    if (isInitialUpdateRef.current) {
      setAsks(asks);
      setBids(bids);
      isInitialUpdateRef.current = false;
    } else {
      // update the diff data-set
      setAsks((prevAsks) => {
        return diffUpdateOrders(prevAsks, asks);
      });
      setBids((prevBids) => {
        return diffUpdateOrders(prevBids, bids);
      });
    }
  }, [query.data])

  return {
    isLoading: query.isLoading,
    asks,
    bids,
  };
}

export default useOrderBookQuery;
