import { feedSlice, fetchOrders } from '../src/services/slices/feedSlice';
import { TFeedsResponse } from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
}));

describe('Редьюсер слайса feedSlice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('fetchOrders.pending', () => {
      const initialState = feedSlice.getInitialState();
      const action = fetchOrders.pending('requestId');
      const state = feedSlice.reducer(initialState, action);
  
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });
  
    it('fetchOrders.fulfilled', () => {
      const feeds: TFeedsResponse = {
        success: true,
        orders: [
          {
            _id: '1',
            ingredients: ['ingredient1', 'ingredient2'],
            status: 'done',
            name: 'Order 1',
            createdAt: '2023-10-01T00:00:00Z',
            updatedAt: '2023-10-01T00:00:00Z',
            number: 1,
          },
        ],
        total: 1,
        totalToday: 1,
      };
  
      const initialState = feedSlice.getInitialState();
      const action = fetchOrders.fulfilled(feeds, 'requestId');
      const state = feedSlice.reducer(initialState, action);
  
      expect(state.status).toBe('succeeded');
      expect(state.feeds).toEqual(feeds);
      expect(state.error).toBeNull();
    });
  
    it('fetchOrders.rejected', () => {
      const initialState = feedSlice.getInitialState();
      const action = fetchOrders.rejected(new Error('Failed to fetch'), 'requestId');
      const state = feedSlice.reducer(initialState, action);
  
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to fetch');
    });
  });
  