import { useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth } from "../types";

const useOrderBook = (productId?: string) => {
  const [orderBook, setOrderBook] = useState<BookDepth | null>(null);
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !productId) return;
    const bookDepthSubscriptionMessage = {
      type: "BookDepth",
      productId,
    };
    socket.emit("subscribe", bookDepthSubscriptionMessage);
    console.log(`Subscribed BookDepth: ${productId}`);
  }, [socket, connected, productId]);

  useEffect(() => {
    if (!socket || !connected) return;

    // inner function to keep the callback reference consistent
    const handleOrderBook = async (message: string) => {
      console.log(`[BookDepth] Received ${message}`)
      try {
        const data: BookDepth = JSON.parse(message);
        if (data.productId === productId) {
          setOrderBook(data);
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
    orderBook
  };
}

export default useOrderBook;
