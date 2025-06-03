import { burgerConstructorSlice, addIngredient, removeIngredient, moveIngredient } from '../src/services/slices/burgerConstructorSlice';
import { TIngredient } from '../src/utils/types';
//one
jest.mock('../src/utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
}));

const createTestIngredient = (overrides = {}): TIngredient => ({
  _id: 'test-id-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 50,
  image: 'test-image.png',
  image_mobile: 'test-mobile.png',
  image_large: 'test-large.png',
  __v: 0,
  ...overrides
});

describe('Слайс конструктора бургера', ()=> {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('должен корректно добавлять ингредиенты в конструктор', () => {
      const testIngredient = createTestIngredient({ _id: 'ing-1', name: 'Соус особый' });
      const initialState = burgerConstructorSlice.getInitialState();
      const nextState = burgerConstructorSlice.reducer(initialState, addIngredient(testIngredient));
      
      expect(nextState.constructorItems.ingredients).toHaveLength(1);
      expect(nextState.constructorItems.ingredients[0]).toEqual(expect.objectContaining({
        _id: 'ing-1',
        name: 'Соус особый'
      }));
    });
    
    it('должен удалять ингредиенты из конструктора по индексу', () => {
      const testIngredient = createTestIngredient({ _id: 'ing-delete-test' });
      
      const stateWithIngredient = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          bun: null,
          ingredients: [testIngredient],
        },
      };
      
      const resultState = burgerConstructorSlice.reducer(stateWithIngredient, removeIngredient(0));
      
      expect(resultState.constructorItems.ingredients).toHaveLength(0);
      expect(resultState.constructorItems.ingredients.find(item => item._id === 'ing-delete-test')).toBeUndefined();
    });
  
    it('должен менять порядок ингредиентов при перетаскивании', () => {
      const firstIngredient = createTestIngredient({ _id: 'ing-first', name: 'Первый ингредиент' });
      const secondIngredient = createTestIngredient({ _id: 'ing-second', name: 'Второй ингредиент' });
      
      const stateWithIngredients = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient],
        },
      };
  
      const reorderedState = burgerConstructorSlice.reducer(
        stateWithIngredients, 
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );
      
      expect(reorderedState.constructorItems.ingredients).toHaveLength(2);
      expect(reorderedState.constructorItems.ingredients[0]._id).toBe('ing-second');
      expect(reorderedState.constructorItems.ingredients[1]._id).toBe('ing-first');
    });
    
    test.each([
      { 
        name: 'добавление ингредиента',
        initialState: burgerConstructorSlice.getInitialState(),
        action: addIngredient(createTestIngredient({ _id: 'test-each-id' })),
        validator: (state: ReturnType<typeof burgerConstructorSlice.getInitialState>) => {
          expect(state.constructorItems.ingredients).toHaveLength(1);
          expect(state.constructorItems.ingredients[0]._id).toBe('test-each-id');
        }
      },
      {
        name: 'удаление ингредиента',
        initialState: {
          ...burgerConstructorSlice.getInitialState(),
          constructorItems: {
            bun: null,
            ingredients: [createTestIngredient({ _id: 'to-be-removed' })],
          },
        },
        action: removeIngredient(0),
        validator: (state: ReturnType<typeof burgerConstructorSlice.getInitialState>) => {
          expect(state.constructorItems.ingredients).toHaveLength(0);
        }
      }
    ])('проверка операции $name в конструкторе', ({ initialState, action, validator }) => {
      const resultState = burgerConstructorSlice.reducer(initialState, action);
      validator(resultState);
    });
});
