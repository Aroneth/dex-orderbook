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
    const handleOrderBook = async (message: BookDepth) => {
      console.log(`[BookDepth] Received ${message}`)
      // if (data.productId === symbol) {
      //   setOrderBook(data);
      // }
    };

    socket.on("BookDepth", handleOrderBook);

    return () => {
      socket.off("BookDepth", handleOrderBook);
    };
  }, [connected, socket]);

  return {
    orderBook
  };
}

export default useOrderBook;
