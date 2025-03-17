import { OrderUnit } from "../types";

export const diffUpdateOrders = (oldOrders: OrderUnit[], newOrders: OrderUnit[]): OrderUnit[] => {
  const newOrdersMap = new Map<string, string>(oldOrders);

  newOrders.forEach(([price, quantity]) => {
    if (newOrdersMap.has(price)) {
      const oldQuantity = newOrdersMap.get(price);
      if (oldQuantity !== quantity) {
        newOrdersMap.set(price, quantity);
      }
    } else {
      newOrdersMap.set(price, quantity);
    }
  });
  // return as array from updated map
  return Array.from(newOrdersMap);
}
