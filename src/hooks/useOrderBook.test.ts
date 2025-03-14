// import { renderHook, act } from '@testing-library/react-hooks';
// import useOrderBook from './useOrderBook';
// import { useSocket } from '../providers/SocketProvider';
// import { BookDepth } from '../types';

import exp from "constants"

// jest.mock('../providers/SocketProvider');

// const mockSubscribleBookDepth = jest.fn();
// const mockUnsubscribeBookDepth = jest.fn();

// useSocket.mockReturnValue({
//   subscribleBookDepth: mockSubscribleBookDepth,
//   unsubscribeBookDepth: mockUnsubscribeBookDepth,
// });

// describe('useOrderBook', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should subscribe and unsubscribe to book depth on mount and unmount', () => {
//     const productId = 'BTC-USD';
//     const { unmount } = renderHook(() => useOrderBook(productId));

//     expect(mockSubscribleBookDepth).toHaveBeenCalledWith(productId, expect.any(Function));
//     unmount();
//     expect(mockUnsubscribeBookDepth).toHaveBeenCalledWith('BookDepth');
//   });

//   it('should update asks and bids on receiving data', async () => {
//     const productId = 'BTC-USD';
//     const { result, waitForNextUpdate } = renderHook(() => useOrderBook(productId));

//     const mockData: BookDepth = {
//       productId,
//       timestamp: Date.now(),
//       previousTimestamp: Date.now() - 1000,
//       asks: [[ '50000', '1' ]],
//       bids: [[ '49000', '1' ]],
//     };

//     act(() => {
//       mockSubscribleBookDepth.mock.calls[0][1](mockData);
//     });

//     await waitForNextUpdate();

//     expect(result.current.asks).toEqual(mockData.asks);
//     expect(result.current.bids).toEqual(mockData.bids);
//   });

//   it('should not update asks and bids if productId does not match', async () => {
//     const productId = 'BTC-USD';
//     const { result } = renderHook(() => useOrderBook(productId));

//     const mockData: BookDepth = {
//       productId: 'ETH-USD',
//       timestamp: Date.now(),
//       previousTimestamp: Date.now() - 1000,
//       asks: [[ '3000', '1' ]],
//       bids: [[ '2900', '1' ]],
//     };

//     act(() => {
//       mockSubscribleBookDepth.mock.calls[0][1](mockData);
//     });

//     expect(result.current.asks).toEqual([]);
//     expect(result.current.bids).toEqual([]);
//   });
// });
console.log('test')

export default exp;
