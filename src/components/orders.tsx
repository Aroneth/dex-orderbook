import React from 'react';
import useOrderBook from '../hooks/useOrderBook';
import Order from './order';

interface OrdersProps {
  productId?: string;
  tokenName?: string;
}

const Orders: React.FC<OrdersProps> = ({ productId, tokenName }) => {

  const { orderBook } = useOrderBook(productId);

  return (
    <div>
      <h2>{tokenName}</h2>
      <div>
        {orderBook?.bids?.map((bid, index) => (
          // Use price as key to indentify each UI block in order to make React has better rendering performance
          <Order key={bid[0]} bid={bid} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
