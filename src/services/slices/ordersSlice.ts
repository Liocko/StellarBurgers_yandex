import { getOrdersApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";


export const getOrders = createAsyncThunk(
    'user/getOrders',
    async () => await getOrdersApi()
)

export type TOrdersState = {
    orders: TOrder[]
}

const initialState: TOrdersState = {
    orders: []
};
  
export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
         builder
         .addCase(getOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
         })
        
    }
}); 
