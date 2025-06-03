import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '@api';

export const postOrder = createAsyncThunk(
  'burgerConstructor/postOrder',
  async (data: string[] ) => await orderBurgerApi(data)
)

type ConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    updateBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.ingredients = [...state.constructorItems.ingredients, action.payload];
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(
        (_, i) => i != action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{fromIndex: number, toIndex: number}>) {
      const index1 = action.payload.fromIndex;
      const index2 = action.payload.toIndex;
      [state.constructorItems.ingredients[index1], state.constructorItems.ingredients[index2]] = [
        state.constructorItems.ingredients[index2],
        state.constructorItems.ingredients[index1]
      ];
    },
    clearConstructor(state) {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(postOrder.pending, (state) => {
      state.orderRequest = true;
    })
    .addCase(postOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload.order;
    })
  }
});

export const { 
  updateBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
