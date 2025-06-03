import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const fetchBurgerIngredients = createAsyncThunk<TIngredient[], void>(
  'burgerIngredients/fetchBurgerIngredients',
  async () => await getIngredientsApi()
);

type IngredientsState = {
  ingredients: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  status: 'idle',
  error: null
};

export const burgerIngredientsSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBurgerIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBurgerIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ingredients = action.payload;
      })
      .addCase(fetchBurgerIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});
