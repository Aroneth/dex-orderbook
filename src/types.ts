export type bid = [price:string, quantity:string];

export type BookDepth = {
  productId: string;
  timestamp: number;
  bids: bid[];
  asks: [string, string][];
  previousTimestamp?: number | undefined;
}
