import { diffUpdateOrders } from './orderBook';
import { OrderUnit } from '../types';

describe('diffUpdateOrders', () => {
  it('should update the quantities of existing orders', () => {
    const oldOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    const newOrders: OrderUnit[] = [['100', '2'], ['101', '2']];
    const expectedUpdatedOrders: OrderUnit[] = [['100', '2'], ['101', '2']];
    expect(diffUpdateOrders(oldOrders, newOrders)).toEqual(expectedUpdatedOrders);
  });

  it('should not change orders if quantities are the same', () => {
    const oldOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    const newOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    const expectedUpdatedOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    expect(diffUpdateOrders(oldOrders, newOrders)).toEqual(expectedUpdatedOrders);
  });

  it('should add new orders that are not in the old orders', () => {
    const oldOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    const newOrders: OrderUnit[] = [['100', '2'], ['101', '2'], ['102', '3']];
    const expectedUpdatedOrders: OrderUnit[] = [['100', '2'], ['101', '2'], ['102', '3']];
    expect(diffUpdateOrders(oldOrders, newOrders)).toEqual(expectedUpdatedOrders);
  });

  it('should return the old orders if new orders are empty', () => {
    const oldOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    const newOrders: OrderUnit[] = [];
    const expectedUpdatedOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    expect(diffUpdateOrders(oldOrders, newOrders)).toEqual(expectedUpdatedOrders);
  });

  it('should return new orders if old orders are empty', () => {
    const oldOrders: OrderUnit[] = [];
    const newOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    const expectedUpdatedOrders: OrderUnit[] = [['100', '1'], ['101', '2']];
    expect(diffUpdateOrders(oldOrders, newOrders)).toEqual(expectedUpdatedOrders);
  });
});
