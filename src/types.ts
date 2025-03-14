export type Bid = [price:string, quantity:string];

export type BookDepth = {
  productId: string;
  timestamp: number;
  bids: Bid[];
  asks: [string, string][];
  previousTimestamp?: number | undefined;
}
