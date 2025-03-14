import React from 'react';
// import useOrderBookQuery from '../hooks/useOrderBookQuery';
import useOrderBook from '../hooks/useOrderBook';
import Order from './order';

interface OrdersProps {
  productId?: string;
  tokenName?: string;
}

const Orders: React.FC<OrdersProps> = ({ productId, tokenName }) => {

  // const { asks, bids } = useOrderBookQuery(productId);
  const { asks, bids } = useOrderBook(productId);

  return (
    <div>
      <h2>{tokenName}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {bids?.map((bid, index) => (
            // Use price as key to indentify each UI block in order to make React has better rendering performance
            <Order key={bid[0]} order={bid} isBid />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
          {asks?.map((ask, index) => (
            // Use price as key to indentify each UI block in order to make React has better rendering performance
            <Order key={ask[0]} order={ask} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
