import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import apiClient from '../../axios';
import { IProduct } from '../../types/product';

export interface FetchProductsParams {
    title?: string;
    tags?: string;
    user?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface ProductsState {
    items: IProduct[];
    status: 'loading' | 'success' | 'error';
    error?: string;
}

export const fetchProducts = createAsyncThunk<IProduct[], FetchProductsParams>(
    'product/fetchProductsStatus', 
    async (params) => {
    // const items = await apiClient.get(`/items`)
    // console.log(items.data.items)
    const { data } = await apiClient.get(`/api/items`, {
        params
    })
    
    console.log(data);
    return data.items
})

const initialState: ProductsState = {
  items: [],
  status: 'loading',
}

const productsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      // builder.addCase(fetchProducts.pending, (state) => {
      //     state.status = 'loading'
      // })

      builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.items = action.payload
        state.status = 'success'
      })

      builder.addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'error'
        state.items = []
        state.error = action.error.message
        console.error('Была ошибка:', action.error.message)
      })
      
    },
  })


export default productsSlice.reducer