import { useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { BookDepth } from "../types";

const useOrderBook = (symbol: string) => {
  const [orderBook, setOrderBook] = useState<BookDepth | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

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
  }, [socket, symbol]);

  return {
    orderBook
  };
}

export default useOrderBook;
