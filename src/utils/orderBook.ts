import { OrderUnit } from "../types";

export const diffUpdateOrders = (oldOrders: OrderUnit[], newOrders: OrderUnit[]): OrderUnit[] => {
  const oldOrdersMap = new Map<string, string>(oldOrders);

  newOrders.forEach(([price, quantity]) => {
    if (oldOrdersMap.has(price)) {
      const oldQuantity = oldOrdersMap.get(price);
      if (oldQuantity !== quantity) {
        oldOrdersMap.set(price, quantity);
      }
    } else {
      oldOrdersMap.set(price, quantity);
    }
  });
  // return as array from updated map
  return Array.from(oldOrdersMap);
}
