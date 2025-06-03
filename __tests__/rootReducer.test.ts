import store from '../src/services/store';
import { burgerIngredientsSlice } from '../src/services/slices/burgerIngredientsSlice';
import { burgerConstructorSlice } from '../src/services/slices/burgerConstructorSlice';
import { feedSlice } from '../src/services/slices/feedSlice';
import { userSlice } from '../src/services/slices/userSlice';
import { ordersSlice } from '../src/services/slices/ordersSlice';
// four
describe('Управление глобальным состоянием приложения', () => {
    it('должен корректно инициализировать все начальные состояния через rootReducer', () => {
      const state = store.getState();
      
      const expectedInitialState = {
        burgerIngredients: burgerIngredientsSlice.getInitialState(),
        burgerConstructor: burgerConstructorSlice.getInitialState(),
        feeds: feedSlice.getInitialState(),
        user: userSlice.getInitialState(),
        orders: ordersSlice.getInitialState(),
      };
  
      expect(state).toEqual(expectedInitialState);
    });
    
    it('должен правильно обрабатывать неизвестные экшены', () => {
      const initialState = store.getState();
      
      store.dispatch({ type: 'UNKNOWN_ACTION_TYPE' });
      const stateAfterUnknownAction = store.getState();
      
      expect(stateAfterUnknownAction).toEqual(initialState);
    });
    
    it('проверяет структуру глобального состояния приложения', () => {
      const state = store.getState();
      
      expect(state).toHaveProperty('burgerIngredients');
      expect(state).toHaveProperty('burgerConstructor');
      expect(state).toHaveProperty('feeds');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('orders');
      
      expect(state.burgerConstructor).toHaveProperty('constructorItems');
      expect(state.burgerConstructor.constructorItems).toHaveProperty('bun');
      expect(state.burgerConstructor.constructorItems).toHaveProperty('ingredients');
    });
});
