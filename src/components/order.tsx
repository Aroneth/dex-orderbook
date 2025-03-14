import { FC } from "react"
import { Bid } from "../types"

const Order: FC<{ bid: Bid }>= ({ bid }) => {
  const [price, quantity] = bid;

  return (
    <div 
      style={{ 
        display: 'block', 
        width: `${Number(quantity) * 100}px`, 
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
  )
}

export default Order
