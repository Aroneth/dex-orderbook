import { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth, OrderUnit } from "../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { diffUpdateOrders } from "../utils/orderBook";

const useOrderBookQuery = (productId?: string) => {
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  const [asks, setAsks] = useState<OrderUnit[]>([]);
  const [bids, setBids] = useState<OrderUnit[]>([]);

  const isInitialUpdateRef = useRef(false);

  // Empty inifnity query to use the cache only
  const query = useQuery({
    queryKey: ['orderbook', productId],
    queryFn: async () => ({
      asks: [],
      bids: [],
    }),
    staleTime: Infinity,
    enabled: connected && !!socket,
  })

  useEffect(() => {
    if (!socket || !connected || !productId) return;

    const bookDepthSubscriptionMessage = {
      type: "BookDepth",
      productId,
    };
    socket.emit("subscribe", bookDepthSubscriptionMessage);
    console.log(`Subscribed BookDepth in Query: ${productId}`);
    isInitialUpdateRef.current = true;

    socket.on("BookDepth", async (message: string) => {
      // console.log(`[BookDepth] Received in Query ${message}`)
      try {
        const data: BookDepth = JSON.parse(message);
        if (data.productId !== productId) return;

        // update the cache directly
        queryClient.setQueryData(['orderbook', productId], {
          asks: data.asks,
          bids: data.bids,
        });
      } catch (error) {
        console.error(`[BookDepth] Error in Query: ${error}`);
      }
    });
    console.log(`Subscribed BookDepth in Query: ${productId}`);
  }, [socket, connected, productId, queryClient])

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
