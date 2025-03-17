import { FC } from "react"
import { OrderUnit } from "../types"

const Order: FC<{ order: OrderUnit; isBid?: boolean }>= ({ order, isBid }) => {
  const [price, quantity] = order;
  // Make the width of each block proportional to the quantity
  const quantityDecimal = Math.pow(10, -Math.floor(Math.log10(Number(quantity))));

  return (
    <div 
      style={{ 
        display: 'block', 
        width: `${Number(quantity) * quantityDecimal * 50}px`, 
        border: 0, 
        marginBottom: '5px', 
        color: 'white',
        backgroundColor: isBid ? 'rgb(37, 167, 80)' : 'rgb(202, 63, 100)',
        paddingLeft: '10px',
      }}
    >
      {price}
    </div>
  )
}

export default Order
