import React from 'react';
import { bid } from '../types';

interface OrdersProps {
    bids: bid[];
}

const Orders: React.FC<OrdersProps> = ({ bids }) => {
  return (
    <div>
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
