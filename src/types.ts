export type OrderUnit = [price:string, quantity:string];

export type BookDepth = {
  productId: string;
  timestamp: number;
  bids: OrderUnit[];
  asks: OrderUnit[];
  previousTimestamp?: number | undefined;
}
