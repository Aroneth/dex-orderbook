import { useEffect } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth } from "../types";
import { useQuery } from "react-query";

const useOrderBook = (productId?: string) => {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !productId) return;
    const bookDepthSubscriptionMessage = {
      type: "BookDepth",
      productId,
    };
    socket.emit("subscribe", bookDepthSubscriptionMessage);
    console.log(`Subscribed BookDepth in Query: ${productId}`);
  }, [socket, connected, productId]);

  const query = useQuery({
    // Socket unsubscribe has no good place in react-query, so put productId out of dependencies to avoid re-subscribe
    queryKey: ['orderbook', socket, connected],
    queryFn: async () => {
      if (!socket || !connected || !productId) return;

      const subscribePromise = new Promise((resolve, reject) => {
        socket.on("BookDepth", async (message: string) => {
          console.log(`[BookDepth] Received in Query ${message}`)
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
  })

  return query;
}

export default useOrderBook;
