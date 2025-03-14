import React from 'react';
import { bid } from '../types';
import useOrderBook from '../hooks/useOrderBook';

interface OrdersProps {
    productId?: string;
    tokenName?: string;
}

const bids: bid[] = [
  ['2997', '150'],
  ['2996', '160'],
  ['3000', '120'],
  ['2995', '170'],
  ['2994', '180'],
  ['2999', '130'],
  ['2998', '140'],
  ['2993', '130'],
];

const Orders: React.FC<OrdersProps> = ({ productId, tokenName }) => {

  const { orderBook } = useOrderBook(productId);

  return (
    <div>
      <h2>{tokenName}</h2>
      <div>
        {bids.map(([price, quantity], index) => (
          <div 
            key={index} 
            style={{ 
              display: 'block', 
              width: `${quantity}px`, 
              border: 0, 
              marginBottom: '5px', 
              backgroundColor: 'rgb(37, 167, 80)',
              color: 'white',
              textAlign: 'left',
              paddingLeft: '10px',
            }}
          >
            {price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
