import { getOrdersApi, getUserApi, loginUserApi, logoutApi, registerUserApi, TLoginData, TRegisterData, updateUserApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteCookie, setCookie } from "../../utils/cookie";
import { TUser } from "@utils-types";

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (data: TLoginData, { rejectWithValue }) => {
        const res = await loginUserApi(data);
        if(!res?.success)
            return rejectWithValue(data);
        setCookie('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        return res.user;
    }
);

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (data: TRegisterData, { rejectWithValue }) => {
        const res = await registerUserApi(data)
        if(!res?.success)
            return rejectWithValue(data);
        setCookie('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        return res.user;
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue}) =>  {
        const res = await logoutApi()
        if(!res?.success)
            return rejectWithValue({});
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
    }
)

export const getUser = createAsyncThunk(
    'user/getUser',
    async () => await getUserApi()
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (user: Partial<TRegisterData>) => await updateUserApi(user)
);


export type TUserState = {
    isAuthChecked: boolean,
    isLoading: boolean,
    user: TUser | null
}

const initialState: TUserState = {
    isAuthChecked: false,
    isLoading: false,
    user: null
  };
  
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
         builder
         .addCase(loginUser.pending, (state) => {
            state.isAuthChecked = true;
            state.isLoading = true;
        })
         .addCase(loginUser.rejected, (state) => {
             state.isAuthChecked = true;
             state.isLoading = false;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
             state.user = action.payload;
             state.isAuthChecked = true;
             state.isLoading = false;
         })
         .addCase(getUser.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getUser.rejected, (state) => {
            state.isAuthChecked = true;
            state.isLoading = false;
         })
         .addCase(getUser.fulfilled, (state, action) => {
            state.user = action.payload?.user!;
            state.isAuthChecked = true;
            state.isLoading = false;
         })
         .addCase(updateUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
         })
         .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthChecked = true;
         })
    }
}); 
